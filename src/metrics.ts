import { metricsCounterPath } from './urls';
import { promisifiedKiteAPIRequest } from './utils';
import * as Logger from 'kite-connector/lib/logger';

export function sendFeatureMetric(name) {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const path = metricsCounterPath();

  // Logger.debug('feature metric:', name);

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
