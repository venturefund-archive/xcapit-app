import { Lender } from '../lender.interface';
import { rawLender } from '../raw-lender.fixture';
import { RawLender } from '../raw-lender.type';

export class FakeLender implements Lender {

  constructor(private _aRawLender: RawLender = rawLender) {}

  firstStepUrl(): string {
    return this._aRawLender.firstStepUrl;
  }

  logo(): string {
    return this._aRawLender.logo;
  }

  url(): string {
    return this._aRawLender.url;
  }

  json(): RawLender {
    return this._aRawLender;
  }

  depositAddress(): string {
    return this._aRawLender.address;
  }

  minWarrantyAmount(): string {
    return `${this._aRawLender.minAmount}`;
  }
}
