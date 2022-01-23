export function metricsCounterPath() {
  return '/clientapi/metrics/counters';
}

export function completionsPath() {
  return '/clientapi/editor/complete';
}

export function normalizeDriveLetter(str: string) {
  return str.replace(/^[a-z]:/, (m) => m.toUpperCase());
}
