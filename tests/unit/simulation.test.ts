import { describe, expect, it } from "vitest";
import {
  defaultSimulationConfig,
  generateSeries,
  isFiniteSeries,
  toCsv,
  toJson
} from "@/lib/simulation";

describe("教学模拟引擎", () => {
  it("相同参数与种子产生相同数据", () => {
    expect(generateSeries(defaultSimulationConfig, 80)).toEqual(generateSeries(defaultSimulationConfig, 80));
  });

  it("所有图表数值均为有限数", () => {
    expect(isFiniteSeries(generateSeries(defaultSimulationConfig, 360))).toBe(true);
  });

  it("数据数组有上限", () => {
    expect(generateSeries(defaultSimulationConfig, 9999)).toHaveLength(360);
  });

  it("CSV 与 JSON 可导出且包含科学声明", () => {
    const data = generateSeries(defaultSimulationConfig, 4);
    expect(toCsv(data)).toContain("specimenTemperature");
    expect(toCsv(data).split("\n")).toHaveLength(5);
    expect(toJson(data)).toContain("不是材料疲劳寿命计算模型");
  });
});
