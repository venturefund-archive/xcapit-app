import { HtmlOf } from './html-of';

describe('HtmlOf', () => {
  let htmlOf: HtmlOf;
  const aText = 'Hello';

  beforeEach(() => {
    htmlOf = new HtmlOf(aText);
  });

  it('new', () => {
    expect(htmlOf).toBeTruthy();
  });

  it('value', () => {
    const expectedHtml = document.createElement('div');
    expectedHtml.appendChild(document.createTextNode(aText));
    expect(htmlOf.value()).toEqual(expectedHtml);
  });
});
