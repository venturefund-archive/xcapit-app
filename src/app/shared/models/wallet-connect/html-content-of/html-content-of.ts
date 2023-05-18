import { HtmlHeaderOf } from '../html-header-of/html-header-of';

export class HtmlContentOf {
  constructor(private _anObject: any) {}

  value() {
    let res: HTMLElement;
    const html = document.createElement('div');

    for (const key in this._anObject) {
      if (typeof this._anObject[key] !== 'object') {
        res = new HtmlHeaderOf(key, this._anObject[key]).value();
      } else {
        res = this._headerWithChildren(key);
      }

      html.appendChild(res);
    }

    return html;
  }

  private _headerWithChildren(key: string) {
    const header = new HtmlHeaderOf(key).value();
    const subContent = new HtmlContentOf(this._anObject[key]).value();
    header.appendChild(subContent);
    return header;
  }
}
