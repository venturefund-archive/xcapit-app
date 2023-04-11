import { HtmlHeaderOf } from './html-header-of';

describe('HtmlHeaderOf', () => {
  let htmlHeaderOf: HtmlHeaderOf;

  beforeEach(() => {
    htmlHeaderOf = new HtmlHeaderOf('A test header');
  });

  it('new', () => {
    expect(htmlHeaderOf).toBeTruthy();
  });

  it('value', () => {
    expect(htmlHeaderOf.value().outerHTML.toString()).toEqual(
      '<div style="margin-left: 16px;"><span style="font-weight: 700;">A test header: </span></div>'
    );
  });

  it('value with body', () => {
    htmlHeaderOf = new HtmlHeaderOf('A test header', 'A test body');
    expect(htmlHeaderOf.value().outerHTML.toString()).toEqual(
      '<div style="margin-left: 16px;"><span style="font-weight: 700;">A test header: </span><span>A test body</span></div>'
    );
  });
});
