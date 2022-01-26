import {
  CancellationToken,
  Hover,
  HoverProvider,
  MarkedString,
  Position,
  ProviderResult,
  TextDocument,
  window,
} from 'coc.nvim';
import { hoverPath } from './urls';

export class KiteHoverProvider implements HoverProvider {
  public async provideHover(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): Promise<Hover | null | undefined> {
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
      const contents: MarkedString[] = [];
      if (data.symbol?.length) {
        console.error(`data.symbol.lenth: ${data.symbol.length}`);
        data.symbol[0].value.forEach((val) => {
          contents.push({
            language: 'Markdown',
            value: `[${val.kind}] ${val.repr}\n\n${val.synopsis}`,
          });
        });
      }
      return {
        contents,
      };
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
