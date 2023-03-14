import { BitrefillURL } from './bitrefill-url';
describe('BitrefillURL', () => {
  it('new', () => {
    expect(new BitrefillURL('', '', '')).toBeTruthy();
  });

  it('value', () => {
    const baseUrl = 'https://www.bitrefill.com/embed/';
    const paymentMethod = 'usdc_polygon';
    const languageCode = 'en';
    const affiliateCode = 'testAffiliateCode';
    const utmSource = 'xcapit';
    expect(new BitrefillURL(paymentMethod, languageCode, affiliateCode, baseUrl, utmSource).value()).toEqual(
      `${baseUrl}?paymentMethod=${paymentMethod}&hl=${languageCode}&ref=${affiliateCode}&utm_source=${utmSource}`
    );
  });
});
