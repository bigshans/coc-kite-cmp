import {
  CancellationToken,
  commands,
  CompleteResult,
  CompletionContext,
  CompletionList,
  ExtensionContext,
  languages,
  listManager,
  Position,
  sources,
  TextDocument,
  window,
  workspace,
} from 'coc.nvim';
import { featureRequested } from './metrics';
import * as KiteAPI from 'kite-api';
import { COMPILED_EXTENSIONS, KITE_BRANDING, SUPPORTED_LANGUAGE } from './constants';
import { KiteCompletionProvider } from './completion';

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration('coc-kite');
  if (!config.get<boolean>('enable', true)) {
    return;
  }
  const { subscriptions } = context;
  featureRequested('staring');
  try {
    await KiteAPI.isKiteInstalled();
  } catch (err) {
    if (err instanceof Error && err?.message.includes('Unable to find Kite application install')) {
      const item = await window.showQuickpick(
        ['Install', 'No'],
        `Unable to find Kite Engine. The Kite Engine is needed to power Kite's completions experience.`
      );
      if (item === 0) {
        commands.executeCommand('vscode.open', 'https://kite.com/').catch();
      }
    }
    return;
  }
  subscriptions.push(
    languages.registerCompletionItemProvider(
      'kite',
      KITE_BRANDING,
      SUPPORTED_LANGUAGE,
      new KiteCompletionProvider(),
      COMPILED_EXTENSIONS
    )
  );
}
