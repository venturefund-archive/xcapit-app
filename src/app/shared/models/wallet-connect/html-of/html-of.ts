export class HtmlOf {
  constructor(private _aText: string) {}

  value(): HTMLElement {
    const html = document.createElement('div');
    html.appendChild(document.createTextNode(this._aText));
    return html;
  }
}
