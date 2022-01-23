import {
  CompletionItemKind,
  Range,
  InsertTextFormat,
  Uri,
  window,
  workspace,
  CompletionItemProvider,
  CompletionList,
  CompletionItem,
  CancellationToken,
  CompletionContext,
  Position,
  ProviderResult,
  TextDocument,
  fetch,
} from 'coc.nvim';
import { OFFSET_ENCODING, MAX_FILE_SIZE } from './constants';
import { normalizeDriveLetter, completionsPath } from './urls';
import * as KiteAPI from 'kite-api';

function fill(s, l, f = ' ') {
  let result = s;
  while (result.length < l) {
    result = `${f}${result}`;
  }
  return result;
}

function kindForHint(hint: string) {
  switch (hint) {
    case 'call':
    case 'function':
      return CompletionItemKind.Function;
    case 'module':
      return CompletionItemKind.Module;
    case 'type':
      return CompletionItemKind.Class;
    case 'keyword':
      return CompletionItemKind.Keyword;
    case 'string':
      return CompletionItemKind.Value;
    default:
      return CompletionItemKind.Value;
  }
}

function processCompletion(document: TextDocument, c, displayPrefix = '', numDigits = 0, idx = 0) {
  const item: CompletionItem = {
    label: displayPrefix + c.display,
  };
  if (c.display.includes('…')) {
    c.display = c.display.replace('…', '');
  }
  const p = c.snippet.text.indexOf(c.display);
  item.detail = c.hint;
  item.kind = kindForHint(c.hint);
  item.sortText = fill(String(idx), numDigits, '\0');
  if (idx === 0) {
    item.preselect = true;
  }
  const start = document.positionAt(c.replace.begin);
  const end = document.positionAt(c.replace.end);
  const replaceRange = Range.create(start, end);
  item.filterText = document.getText(replaceRange);
  if (c.documentation.text !== '') {
    item.documentation = {
      kind: 'markdown',
      value: c.documentation.text,
    };
  }
  if (c.snippet.placeholders.length > 0) {
    item.kind = CompletionItemKind.Snippet;
    item.insertText = c.snippet.text;
    item.insertTextFormat = InsertTextFormat.Snippet;
    let offset = 0;
    let i = 0;
    for (i = 0; i < c.snippet.placeholders.length; i++) {
      const placeholder = c.snippet.placeholders[i];
      placeholder.begin += offset;
      placeholder.end += offset;
      item.insertText =
        (item.insertText || '').slice(p, placeholder.begin) +
        '${' +
        (i + 1).toString() +
        ':' +
        (item === null || item === undefined
          ? undefined
          : (item.insertText || '').slice(placeholder.begin, placeholder.end));
      offset += 5;
    }
    // Add closing tab stop
    item.insertText += '$0';
  } else {
    item.insertText = c.display;
  }
  return item;
}

export class KiteCompletionProvider implements CompletionItemProvider {
  public async provideCompletionItems(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
    context?: CompletionContext
  ): Promise<CompletionItem[] | CompletionList | null | undefined> {
    const text = document.getText();
    if (text.length > MAX_FILE_SIZE) {
      window.showMessage('buffer contents too large, not attempting completions');
      return [];
    }
    const filename = normalizeDriveLetter(Uri.parse(document.uri).fsPath);
    return this.getCompletions(document, position, text, filename);
  }

  private async getCompletions(document: TextDocument, position: Position, text: string, filename: string) {
    try {
      const begin = document.offsetAt(position);
      const end = document.offsetAt(position);
      const enableSnippets = workspace.getConfiguration('coc-kite').get('enableSnippets', true);
      const payload = {
        text,
        editor: 'vscode',
        filename,
        position: { begin, end },
        no_snippets: !enableSnippets,
        offset_encoding: OFFSET_ENCODING,
      };
      // window.showMessage(`http://localhost:46624/${completionsPath()}`);
      const data: any = await fetch(`http://localhost:46624${completionsPath()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(payload),
      });
      const completions = data.completions || [];
      const totalCompletions = completions.reduce((total, completion) => {
        let toReturn = total + 1;
        if (completion.children) {
          toReturn += completion.children.length;
        }
        return toReturn;
      }, 0);
      // # of digits needed to represent totalCompletions. Used for sortText.
      const numDigits = String(totalCompletions).length;
      const completionItems: CompletionItem[] = [];
      // Used to track order in suggestion list
      let idx = 0;
      completions.forEach((c) => {
        completionItems.push(processCompletion(document, c, '', numDigits, idx));
        const children = c.children || [];
        let offset = 1;
        children.forEach((child) => {
          completionItems.push(processCompletion(document, child, '  ', numDigits, idx + offset));
          offset += 1;
        });
        idx += offset;
      });
      return completionItems;
    } catch (e) {
      console.error(e);
      if (e instanceof Error && e.message === 'bad_status') {
        window.showMessage(`Completion request to Kite failed`, `warning`);
      }
    }
  }
}
