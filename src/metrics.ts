import { metricsCounterPath } from './urls';
import { promisifiedKiteAPIRequest } from './utils';

export function sendFeatureMetric(name) {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const path = metricsCounterPath();

  return promisifiedKiteAPIRequest(
    {
      path,
      method: 'POST',
    },
    JSON.stringify({
      name,
      value: 1,
    })
  );
}

export function featureRequested(name) {
  sendFeatureMetric(`vscode_${name}_requested`);
}
