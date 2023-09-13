import { Lender } from '../lender.interface';
import { rawLender } from '../raw-lender.fixture';
import { RawLender } from '../raw-lender.type';

export class FakeLender implements Lender {
  constructor(private _aRawLender: RawLender = rawLender) {}
  
  infoModalHighlightedHeader(): string {
    return this._aRawLender.infoModalHighlightedHeader;
  }

  hasCryptoModalDescription(): string {
    return this._aRawLender.hasCryptoModalDescription;
  }

  buyOrDepositModalHeader(): string {
    return this._aRawLender.buyOrDepositModalHeader;
  }

  xscrowAddress(): string {
    return this._aRawLender.xscrowAddress;
  }

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

  token(): string {
    return this._aRawLender.token;
  }

  blockchain(): string {
    return this._aRawLender.blockchain;
  }

  language(): string {
    return this._aRawLender.language;
  }
}
