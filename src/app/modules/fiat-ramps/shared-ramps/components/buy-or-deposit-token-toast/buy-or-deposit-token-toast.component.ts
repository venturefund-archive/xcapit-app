import { Component, OnInit, Input } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { ProviderTokensOf } from '../../models/provider-tokens-of/provider-tokens-of';
import { ProvidersFactory } from '../../models/providers/factory/providers.factory';
import { TokenOperationDataService } from '../../services/token-operation-data/token-operation-data.service';
import { RemoteConfigService } from '../../../../../shared/services/remote-config/remote-config.service';
import { AppVersionInjectable } from '../../../../../shared/models/app-version/injectable/app-version.injectable';
import { DefaultPlatformService } from '../../../../../shared/services/platform/default/default-platform.service';
import { FiatRampsService } from '../../services/fiat-ramps.service';

@Component({
  selector: 'app-buy-or-deposit-token-toast',
  template: `
    <app-toast-with-buttons
      [text]="this.text"
      [primaryButtonText]="this.primaryButtonText"
      [secondaryButtonText]="this.secondaryButtonText"
      (primaryActionEvent)="this.goToSelectProvider()"
      (secondaryActionEvent)="this.goToDeposit()"
    ></app-toast-with-buttons>
  `,
  styleUrls: ['./buy-or-deposit-token-toast.component.css'],
})
export class BuyOrDepositTokenToastComponent implements OnInit {
  @Input() text: string;
  @Input() primaryButtonText: string;
  @Input() secondaryButtonText: string;
  @Input() token: Token;

  constructor(
    private navController: NavController,
    private apiWalletService: ApiWalletService,
    private providersFactory: ProvidersFactory,
    private tokenOperationDataService: TokenOperationDataService,
    private remoteConfigService: RemoteConfigService,
    private appVersion: AppVersionInjectable,
    private platform: DefaultPlatformService,
    private fiatRampsService : FiatRampsService
  ) {}

  async ngOnInit() {
    if (!(await this.isTokenAvailableForPurchase()) || !(await this.isEnabledByReviewFeatureFlag())) {
      this.primaryButtonText = undefined;
    }
  }

  private async isTokenAvailableForPurchase(): Promise<boolean> {
    return !!(await new ProviderTokensOf(this.providersFactory.create(), this.apiWalletService.getCoins(), this.fiatRampsService)
      .all())
      .find((c) => c.value === this.token.symbol() && c.network === this.token.json().network);
  }

  private async isEnabledByReviewFeatureFlag(): Promise<boolean> {
    let enabled = this.remoteConfigService.getFeatureFlag('ff_buyCrypto');

    if (this.platform.isNative()) {
      const inReview = this.remoteConfigService.getFeatureFlag('inReview');
      enabled = !((await this.appVersion.create().updated()) && inReview);
    }
    return enabled;
  }

  goToDeposit() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: this.token.symbol(),
        network: this.token.json().network,
      },
    };

    this.navController.navigateForward(['/wallets/receive/detail'], navigationExtras);
  }

  goToSelectProvider() {
    this.tokenOperationDataService.tokenOperationData = {
      asset: this.token.symbol(),
      network: this.token.json().network,
      mode: 'buy'
    };

    this.navController.navigateForward(['/fiat-ramps/select-provider']);
  }
}
