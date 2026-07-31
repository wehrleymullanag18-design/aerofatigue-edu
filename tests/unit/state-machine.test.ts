import { describe, expect, it } from "vitest";
import { initialContext, transition, type LabAction, type LabState } from "@/lib/state-machine";

function prepare() {
  let state: LabState = "offline";
  let context = initialContext;
  const actions: LabAction[] = [
    "connect", "home", "openDoor", "selectSpecimen", "selectFixture", "install",
    "clamp", "closeDoor", "setParameters", "heat", "cool", "confirmEnvironment",
    "prestress", "check", "start"
  ];
  for (const action of actions) {
    const result = transition(state, action, context);
    expect(result.ok, `${action}: ${result.message}`).toBe(true);
    state = result.state;
    context = result.context;
  }
  return { state, context };
}

describe("实验状态机", () => {
  it("允许完整合法准备流程并启动", () => {
    expect(prepare().state).toBe("running-hot");
  });

  it("未连接不能归零", () => {
    const result = transition("offline", "home", initialContext);
    expect(result.ok).toBe(false);
    expect(result.message).toContain("未连接");
  });

  it("未归零不能安装试样", () => {
    const context = { ...initialContext, connected: true, doorClosed: false };
    expect(transition("connected", "install", context).ok).toBe(false);
  });

  it("防护门未关闭不能启动", () => {
    const { context } = prepare();
    const result = transition("experiment-ready", "start", { ...context, doorClosed: false });
    expect(result.ok).toBe(false);
    expect(result.message).toContain("防护门");
  });

  it("试样未夹紧不能施加预应力", () => {
    const context = { ...initialContext, connected: true, homed: true, hotReady: true, coldReady: true };
    expect(transition("environment-ready", "prestress", context).ok).toBe(false);
  });

  it("暂停后可以继续", () => {
    const { state, context } = prepare();
    const paused = transition(state, "pause", context);
    expect(paused.state).toBe("paused");
    expect(transition(paused.state, "resume", paused.context).state).toBe("running-hot");
  });

  it("急停后不能直接继续，复位后回到待机", () => {
    const { state, context } = prepare();
    const stopped = transition(state, "emergencyStop", context);
    expect(stopped.state).toBe("emergency-stop");
    expect(transition(stopped.state, "resume", stopped.context).ok).toBe(false);
    const reset = transition(stopped.state, "reset", stopped.context);
    expect(reset.state).toBe("idle");
    expect(reset.context).toEqual(initialContext);
  });

  it("正常实验可以完成", () => {
    const { state, context } = prepare();
    expect(transition(state, "complete", context).state).toBe("completed");
  });
});
