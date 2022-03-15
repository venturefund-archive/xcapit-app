import { Component, Input, OnInit } from '@angular/core';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { ethers } from 'ethers';

@Component({
  selector: 'app-swap-request',
  template: `
    <div>
      <div class="src__action">
        <ion-label class="src__action__title">
        {{ 'wallets.wallet_connect.operation_detail.types.swap.swap' | translate }}
        </ion-label>
        <ion-label class="src__action__info" *ngIf="!this.loading">
          {{ this.symbols[0] }}
          <ion-icon name="ux-long-arrow"></ion-icon> 
          {{ this.symbols[1] }}
        </ion-label>

        <ion-spinner color="primary" name="crescent" *ngIf="this.loading"></ion-spinner>
      </div>

      <div class="src__container">
        <div class="src__container__title">
          <ion-label>
            {{ 'wallets.wallet_connect.operation_detail.date' | translate }}
          </ion-label>
        </div>

        <div class="src__container__content src__container__date">
          <span>{{ this.dateInfo.date }}</span>
          <span>{{ this.dateInfo.time }} H</span>
        </div>
      </div>

      <div class="src__container">
        <div class="src__container__title">
          <ion-label>
          {{ 'wallets.wallet_connect.operation_detail.types.swap.amount_to_send' | translate }}
          </ion-label>
        </div>

        <div class="src__container__content">
          <ion-label *ngIf="!this.loading">
            {{ this.amountIn }} {{this.symbols[0]}}
          </ion-label>
          <ion-label *ngIf="amountInMax && !this.loading" class="src__container__content__info">
            ({{ 'wallets.wallet_connect.operation_detail.types.swap.amount_to_send_max' | translate }})
          </ion-label>

          <ion-spinner style="margin-left: 10px" color="primary" name="crescent" *ngIf="this.loading"></ion-spinner>
        </div>
      </div>

      <div class="src__container">
        <div class="src__container__title">
          <ion-label>
            {{ 'wallets.wallet_connect.operation_detail.types.swap.amount_to_receive' | translate }}
          </ion-label>
        </div>

        <div class="src__container__content">
          <ion-label *ngIf="!this.loading">
            {{ this.amountOut }} {{this.symbols[1]}}
          </ion-label>
          <ion-label *ngIf="amountOutMin  && !this.loading" class="src__container__content__info">
            ({{ 'wallets.wallet_connect.operation_detail.types.swap.amount_to_receive_min' | translate }})
          </ion-label>

          <ion-spinner style="margin-left: 10px" color="primary" name="crescent" *ngIf="this.loading"></ion-spinner>
        </div>
      </div>

    </div>
  `,
  styleUrls: ['./swap-request.component.scss'],
})
export class SwapRequestComponent implements OnInit {
  @Input() request: any;
  @Input() providerSymbol: string;
  @Input() decodedData: any;
  @Input() dateInfo: any;

  public symbols = [];
  public amountIn;
  public amountOut;
  public amountOutMin = false;
  public amountInMax = false;
  public loading = true;

  constructor(
    private walletConnectService: WalletConnectService
  ) { }

  ngOnInit() {
    this.setTokensSymbols();
  }

  async setTokensSymbols() {
    const tokensAddresses = this.decodedData.data.filter((data) => data.name === 'path')[0];

    if(this.decodedData.useNative) {
      this.symbols[this.decodedData.nativeOrder] = this.providerSymbol;
      const nextOrder = this.decodedData.nativeOrder === 1 ? 0 : tokensAddresses.value.length - 1;

      this.symbols[nextOrder] = await this.walletConnectService.getTokenSymbol(tokensAddresses.value[nextOrder]);
    } else {
      this.symbols[0] = await this.walletConnectService.getTokenSymbol(tokensAddresses.value[0]);
      this.symbols[1] = await this.walletConnectService.getTokenSymbol(tokensAddresses.value[tokensAddresses.value.length - 1]);
    }

    this.parseInfo();
    this.setAmountsInfo();
    
    this.loading = false;
  }

  parseInfo() {
    if (this.decodedData.hasValue) {
      const outValue = this.decodedData.data.filter((data) => data.name === this.decodedData.out)[0];
      
      this.amountOut = ethers.utils.formatEther(ethers.BigNumber.from(outValue.value));
      this.amountIn = ethers.utils.formatEther(ethers.BigNumber.from(this.request.params[0].value));
    } else {
      const inValue = this.decodedData.data.filter((data) => data.name === this.decodedData.in)[0];
      const outValue = this.decodedData.data.filter((data) => data.name === this.decodedData.out)[0];

      this.amountOut = ethers.utils.formatEther(ethers.BigNumber.from(outValue.value));
      this.amountIn = ethers.utils.formatEther(ethers.BigNumber.from(inValue.value));
    }
  }

  setAmountsInfo() {
    this.amountOutMin = this.decodedData.out === 'amountOutMin';
    this.amountInMax = this.decodedData.in === 'amountInMax';
  }


}
