// Basic Web Vitals reporter hook for client; logs to console for now.
export function reportWebVitals(metric: {
  name: string;
  value: number;
  id: string;
}) {
  // In real usage, send to analytics endpoint
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.debug('[Vitals]', metric.name, Math.round(metric.value), metric.id);
  }
}


