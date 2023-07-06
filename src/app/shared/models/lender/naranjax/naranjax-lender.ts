import { TranslateService } from '@ngx-translate/core';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { Lender } from '../lender.interface';
import { RawLender } from '../raw-lender.type';

export class NaranjaXLender implements Lender {
  constructor(private readonly _aTranslateService: TranslateService | FakeTranslateService) {}

  public firstStepUrl(): string {
    return '/wallets/steps-naranjax';
  }

  public logo(): string {
    return 'assets/img/warranty/naranjax.svg';
  }

  public url(): string {
    return 'https://www.naranjax.com/';
  }

  json(): RawLender {
    return {
      icon: this._icon(),
      title: this._title(),
      description: this._description(),
      firstStepUrl: this.firstStepUrl(),
      trackClickEvent: this._trackClickEvent(),
      isWarrantyLender: this._isWarrantyLender(),
    };
  }

  private _icon(): string {
    return 'assets/ux-icons/ux-logo-naranjax.svg';
  }
  private _title(): string {
    return this._aTranslateService.instant('wallets.select_wallet_type.warranty_wallet.title');
  }

  private _description(): string {
    return this._aTranslateService.instant('wallets.select_wallet_type.warranty_wallet.description');
  }

  private _trackClickEvent(): string {
    return 'ux_create_select_naranjax';
  }

  private _isWarrantyLender(): boolean {
    return true;
  }
}
