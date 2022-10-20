import { Component, OnInit, Input } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { ProviderTokensOf } from '../../models/provider-tokens-of/provider-tokens-of';
import { ProvidersFactory } from '../../models/providers/factory/providers.factory';
import { TokenOperationDataService } from '../../services/token-operation-data/token-operation-data.service';

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
    private tokenOperationDataService: TokenOperationDataService
  ) {}

  ngOnInit() {
    this.primaryButtonText = this.isTokenAvailableForPurchase() ? this.primaryButtonText : undefined;
  }

  private isTokenAvailableForPurchase(): boolean {
    return !!new ProviderTokensOf(this.providersFactory.create(), this.apiWalletService.getCoins())
      .all()
      .find((c) => c.value === this.token.symbol() && c.network === this.token.json().network);
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
    };
    
    this.navController.navigateForward(['/fiat-ramps/select-provider']);
  }
}
