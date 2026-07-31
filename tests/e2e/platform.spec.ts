import { expect, test } from "@playwright/test";

test("首页四种模式与真实设备证据可见", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /AeroFatigue/ })).toBeVisible();
  for (const label of ["学习模式", "练习模式", "考核模式", "答辩演示"]) {
    await expect(page.getByRole("heading", { name: label })).toBeVisible();
  }
  await expect(page.getByAltText("真实预应力温度循环疲劳设备总览")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("设备热点与认知测验可操作", async ({ page }) => {
  await page.goto("/device");
  await page.getByRole("button", { name: "查看上位机" }).click();
  await expect(page.getByRole("heading", { name: "上位机" })).toBeVisible();
  await page.getByRole("button", { name: "设备整体" }).click();
  await page.getByRole("button", { name: "查看报警指示灯" }).click();
  await expect(page.getByRole("heading", { name: "报警指示灯" })).toBeVisible();
  await page.getByRole("button", { name: /A\. 双自由度作动平台/ }).click();
  await expect(page.getByText("回答正确")).toBeVisible();
});

test("遥测工作区支持测点选择与同步时间回放", async ({ page }) => {
  await page.goto("/analysis");
  await expect(page.getByRole("heading", { name: "实验遥测工作区" })).toBeVisible();
  await page.getByRole("button", { name: /当前预应力/ }).click();
  await expect(page.locator("main").getByRole("heading", { name: "当前预应力" })).toBeVisible();
  await page.getByRole("button", { name: "回到起点" }).click();
  await expect(page.getByText("T+000s", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "跳至最新" }).click();
  await expect(page.getByText("T+149s", { exact: true }).first()).toBeVisible();
});

test("完整准备、运行、暂停继续、完成与报告", async ({ page }) => {
  await page.goto("/lab?mode=practice");
  await expect(page.getByTestId("lab-ready")).toBeAttached();
  const steps = [
    "connect", "home", "open-door", "select-specimen", "select-fixture", "load",
    "clamp", "close-door", "parameters", "heat", "cool", "environment", "prestress", "check", "start"
  ];
  for (const step of steps) await page.getByTestId(`step-${step}`).click();
  await expect(page.getByText("循环实验已启动", { exact: false }).first()).toBeVisible();
  await page.waitForTimeout(1200);
  await page.getByRole("slider", { name: "遥测时间轴" }).fill("0");
  await expect(page.getByText(/历史回放：T\+0s/)).toBeVisible();
  await page.getByRole("button", { name: "跳至最新" }).click();
  await page.getByTestId("pause").click();
  await expect(page.getByText("已暂停", { exact: true }).first()).toBeVisible();
  await page.getByTestId("resume").click();
  await page.waitForTimeout(700);
  await page.getByTestId("finish").click();
  await expect(page.getByRole("link", { name: /打开实验报告/ })).toBeVisible();
  await page.getByRole("link", { name: /打开实验报告/ }).click();
  await expect(page.getByRole("heading", { name: "虚拟实验教学报告" })).toBeVisible();
  await expect(page.getByRole("button", { name: /导出 JSON/ })).toBeVisible();
});

test("安全联锁、急停与答辩键盘切换", async ({ page }) => {
  await page.goto("/lab?mode=exam");
  await expect(page.getByTestId("lab-ready")).toBeAttached();
  await page.getByTestId("safety-interlock").click();
  await expect(page.getByText(/安全联锁演示/).first()).toBeVisible();
  await page.getByTestId("step-connect").click();
  await page.getByTestId("emergency-stop").click();
  await expect(page.getByText("紧急停止", { exact: true }).first()).toBeVisible();
  await expect(page.getByTestId("resume")).toBeDisabled();
  await page.getByTestId("reset").click();
  await expect(page.getByText("待机", { exact: true }).first()).toBeVisible();
  await page.goto("/presentation");
  await expect(page.getByRole("heading", { name: "项目背景" })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("heading", { name: "实体设备" })).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("heading", { name: "项目背景" })).toBeVisible();
});

test("主要页面没有浏览器控制台错误或白屏", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of ["/", "/device", "/lab?mode=practice", "/analysis", "/report", "/teacher", "/presentation", "/science", "/data-import", "/videos"]) {
    await page.goto(route);
    await expect(page.locator("body")).not.toBeEmpty();
    await page.waitForTimeout(250);
  }
  expect(errors).toEqual([]);
});
