export class HtmlHeaderOf {
  constructor(private _aHeader: string, private _aBody: any = null) {}

  public value(): HTMLDivElement {
    const content = document.createElement('div');
    content.style.marginLeft = '16px';
    content.appendChild(this._contentHeader());
    if (this._aBody) content.appendChild(this._contentBody());
    return content;
  }

  private _contentHeader(): HTMLSpanElement {
    const title = document.createElement('span');
    title.style.fontWeight = '700';
    title.appendChild(document.createTextNode(this._aHeader + ': '));
    return title;
  }

  private _contentBody(): HTMLSpanElement {
    const content = document.createElement('span');
    content.appendChild(document.createTextNode(this._aBody));
    return content;
  }
}
