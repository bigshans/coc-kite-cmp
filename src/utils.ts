import * as KiteAPI from 'kite-api';
import { window } from 'coc.nvim';

export function promisifiedKiteAPIRequest(req, data) {
  return KiteAPI.request(req, data)
    .then((resp) => promisifyReadResponse(resp))
    .catch((err) => {
      window.showMessage(err);
    });
}

export function promisifyReadResponse(response) {
  return new Promise((resolve, reject) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => resolve(data));
    response.on('error', (err) => reject(err));
  });
}

export function parseJSON(data: string, fallback: Function) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return fallback;
  }
}

export const getSupportedLanguage = (document) => {
  if (document.isUntitled) {
    return null;
  }

  const ext = document.fileName.split('.').slice(-1)[0];
  if (extToLangMap.has(ext)) {
    return extToLangMap.get(ext);
  }
  return null;
};

export const extToLangMap = new Map([
  ['c', 'c'],
  ['cc', 'cpp'],
  ['cpp', 'cpp'],
  ['cs', 'csharp'],
  ['css', 'css'],
  ['go', 'go'],
  ['h', 'c'],
  ['hpp', 'cpp'],
  ['html', 'html'],
  ['java', 'java'],
  ['js', 'javascript'],
  ['jsx', 'jsx'],
  ['kt', 'kotlin'],
  ['less', 'less'],
  ['m', 'objectivec'],
  ['php', 'php'],
  ['py', 'python'],
  ['pyw', 'python'],
  ['rb', 'ruby'],
  ['scala', 'scala'],
  ['sh', 'bash'],
  ['ts', 'typescript'],
  ['tsx', 'tsx'],
  ['vue', 'vue'],
]);
