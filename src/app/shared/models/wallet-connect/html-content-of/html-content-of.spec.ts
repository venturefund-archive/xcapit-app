import { HtmlContentOf } from './html-content-of';

describe('HtmlContentOf', () => {
  let htmlContentOf: HtmlContentOf;

  const testObject = {
    testHeader: {
      testSubheader: 'testContent',
    },
  };

  beforeEach(() => {
    htmlContentOf = new HtmlContentOf(testObject);
  });

  it('new', () => {
    expect(htmlContentOf).toBeTruthy();
  });

  it('value', () => {
    const expectedHtml =
      '<div><div style="margin-left: 16px;"><span style="font-weight: 700;">testHeader: </span><div><div style="margin-left: 16px;"><span style="font-weight: 700;">testSubheader: </span><span>testContent</span></div></div></div></div>';
    expect(htmlContentOf.value().outerHTML.toString()).toEqual(expectedHtml);
  });
});
