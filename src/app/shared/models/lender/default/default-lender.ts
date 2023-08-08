import { TranslateService } from '@ngx-translate/core';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { Lender } from '../lender.interface';
import { RawLender } from '../raw-lender.type';

export class DefaultLender implements Lender {
  constructor(
    private readonly _aRawLender: RawLender,
    private readonly _aTranslateService: TranslateService | FakeTranslateService
  ) {}

  public firstStepUrl(): string {
    return this._aRawLender.firstStepUrl;
  }

  public logo(): string {
    return this._aRawLender.logo;
  }

  public url(): string {
    return this._aRawLender.url;
  }


  public json(): RawLender {
    return {
      name: this._name(),
      icon: this._icon(),
      title: this._title(),
      description: this._description(),
      firstStepUrl: this.firstStepUrl(),
      trackClickEvent: this._trackClickEvent(),
      address: this.depositAddress(),
      isWarrantyLender: this._isWarrantyLender(),
      minAmount: this.minWarrantyAmount(),
      maxAmount: this._maxAmount(),
      logo: this.logo(),
      url: this.url(),
      token: this.token(),
      blockchain: this.blockchain(),
    };
  }

  public depositAddress(): string {
    return `${this._aRawLender.address}`.toLowerCase();
  }

  public minWarrantyAmount(): string {
    return `${this._aRawLender.minAmount}`;
  }

  public token(): string {
    return this._aRawLender.token;
  }

  public blockchain(): string {
    return this._aRawLender.blockchain;
  }

  private _isWarrantyLender(): boolean {
    return this._aRawLender.isWarrantyLender;
  }

  private _icon(): string {
    return this._aRawLender.icon;
  }

  private _title(): string {
    return this._aTranslateService.instant(this._aRawLender.title);
  }

  private _description(): string {
    return this._aTranslateService.instant(this._aRawLender.description);
  }

  private _trackClickEvent(): string {
    return this._aRawLender.trackClickEvent;
  }

  private _name(): string {
    return this._aRawLender.name;
  }

  private _maxAmount(): string {
    return this._aRawLender.maxAmount;
  }
}
