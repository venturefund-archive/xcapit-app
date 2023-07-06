import { TranslateService } from '@ngx-translate/core';
import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { RawLender } from '../raw-lender.type';
import { Lender } from '../lender.interface';

export class NullLender implements Lender {
  constructor(private readonly _aTranslateService: TranslateService | FakeTranslateService) {}
  public firstStepUrl(): string {
    return '/wallets/create-password/create';
  }

  public logo(): string {
    return null;
  }

  public url(): string {
    return null;
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
    return 'assets/ux-icons/ux-checked-info.svg';
  }

  private _title(): string {
    return this._aTranslateService.instant('wallets.select_wallet_type.web3_wallet.title');
  }

  private _description(): string {
    return this._aTranslateService.instant('wallets.select_wallet_type.web3_wallet.description');
  }

  private _trackClickEvent(): string {
    return 'ux_create_select_web3';
  }

  private _isWarrantyLender(): boolean {
    return false;
  }
}
