import { HttpParams } from '@angular/common/http';

export class BitrefillURL {
  constructor(
    private readonly _aPaymentMethod: string,
    private readonly _aLanguageCode: string,
    private readonly _anAffiliateCode,
    private readonly _aBaseURL = 'https://www.bitrefill.com/embed/',
    private readonly _anUtmSource = 'xcapit'
  ) {}

  public value(): string {
    const params = new HttpParams()
      .set('paymentMethod', this._aPaymentMethod)
      .set('hl', this._aLanguageCode)
      .set('ref', this._anAffiliateCode)
      .set('utm_source', this._anUtmSource);
    return `${this._aBaseURL}?${params}`;
  }
}
