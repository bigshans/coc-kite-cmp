import { Uri } from 'coc.nvim';
import * as crypto from 'crypto';
import { OFFSET_ENCODING } from './constants';

function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

export function metricsCounterPath() {
  return '/clientapi/metrics/counters';
}

export function completionsPath() {
  return '/clientapi/editor/complete';
}

export function normalizeDriveLetter(str: string) {
  return str.replace(/^[a-z]:/, (m) => m.toUpperCase());
}

function cleanPath(p) {
  return encodeURI(normalizeDriveLetter(p))
    .replace(/^([a-zA-Z]):/, (_m, d) => `/windows/${d}`)
    .replace(/\/|\\|%5C/g, ':');
}

export function hoverPath(document, position) {
  const state = md5(document.getText());
  const buffer = cleanPath(Uri.parse(document.uri).fsPath);
  const pos = document.offsetAt(position);
  return [
    `/api/buffer/vscode/${buffer}/${state}/hover`,
    [`cursor_runes=${pos}`, `offset_encoding=${OFFSET_ENCODING}`].join('&'),
  ].join('?');
}
