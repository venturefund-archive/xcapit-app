import { TranslateService } from '@ngx-translate/core';
import { FakeTranslateService } from '../translate-service/fake/fake-translate-service';

export type Option = {
  icon: string;
  title: string;
  description: string;
  firstStepUrl: string;
  trackClickEvent: string;
  isWarrantyLender: boolean;
};

export class Web3Option {
  constructor(private readonly _aTranslateService: TranslateService | FakeTranslateService) {}

  json(): Option {
    return {
      icon: 'assets/ux-icons/ux-checked-info.svg',
      title: this._title(),
      description: this._description(),
      firstStepUrl: '/wallets/create-password/create',
      trackClickEvent: 'ux_create_select_web3',
      isWarrantyLender: false,
    };
  }

  private _title(): string {
    return this._aTranslateService.instant('wallets.select_wallet_type.web3_wallet.title');
  }

  private _description(): string {
    return this._aTranslateService.instant('wallets.select_wallet_type.web3_wallet.description');
  }
}
