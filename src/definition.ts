import {
  CancellationToken,
  Definition,
  DefinitionProvider,
  Position,
  ProviderResult,
  TextDocument,
  extensions,
  Uri,
} from 'coc.nvim';
import { hoverPath } from './urls';

export class KiteDefinitionProvider implements DefinitionProvider {
  public async provideDefinition(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): Promise<Definition | null | undefined> {
    if (extensions.isActivated('coc-python')) {
      return;
    }
    const path = hoverPath(document, position);
    try {
      const data: any = await fetch(`http://localhost:${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!data) {
        return null;
      }
      if (data?.report?.definition) {
        const uri = Uri.file(data.report.definition.filename);
        const line = data.report.definition.line - 1;
        const start = Position.create(line, 0);
        const end = Position.create(line, 0);
        return { uri: uri.toString(), range: { start, end } };
      }
    } catch (e) {
      let _a;
      console.error(e);
      // @ts-ignore
      if (e.message === 'bad_status') {
        // @ts-ignore
        const msg =
          // @ts-ignore
          // eslint-disable-next-line no-void
          ((_a = e === null || e === void 0 ? void 0 : e.data) === null || _a === void 0 ? void 0 : _a.responseData) ||
          '';
        window.showMessage(`Hover failed: ${msg}`, 'warning');
      }
      return null;
    }
  }
}
