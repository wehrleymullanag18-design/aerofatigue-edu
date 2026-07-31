export const faults = [
  { code: "SAFE-001", name: "防护门未关闭", level: "严重", action: "阻止运动并扣安全分", recovery: "关闭防护门后重新检查" },
  { code: "TEMP-101", name: "高温环境未准备", level: "警告", action: "阻止启动", recovery: "完成预热并确认稳定" },
  { code: "TEMP-102", name: "低温环境未准备", level: "警告", action: "阻止启动", recovery: "完成预冷并确认稳定" },
  { code: "SENS-201", name: "压力传感器断连", level: "严重", action: "停止加载", recovery: "检查传感器后复位" },
  { code: "MOVE-301", name: "运动机构受阻", level: "紧急", action: "立即急停", recovery: "排除机械风险后复位" }
];
