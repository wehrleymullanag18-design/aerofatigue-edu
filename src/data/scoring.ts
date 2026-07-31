export const scoringRules = {
  operation: 40,
  safety: 30,
  analysis: 20,
  report: 10,
  deductions: {
    sequence: 2,
    keyStep: 5,
    safetyInterlock: 8,
    emergencyMisuse: 5
  },
  passScore: 60,
  minimumSafety: 18
};

export function calculateScore(
  completedSteps: number,
  totalSteps: number,
  safetyErrors: number
) {
  const operation = Math.round(scoringRules.operation * (completedSteps / totalSteps));
  const safety = Math.max(0, scoringRules.safety - safetyErrors * scoringRules.deductions.safetyInterlock);
  const analysis = completedSteps >= totalSteps ? scoringRules.analysis : 8;
  const report = completedSteps >= totalSteps ? scoringRules.report : 0;
  const total = operation + safety + analysis + report;
  return {
    operation,
    safety,
    analysis,
    report,
    total,
    passed: total >= scoringRules.passScore && safety >= scoringRules.minimumSafety
  };
}
