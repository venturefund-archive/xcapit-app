import { Component, Input, OnInit } from '@angular/core';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { ethers } from 'ethers';

@Component({
  selector: 'app-liquidity-request',
  template: `
    <div>
      <div class="lrc__action">
        <ion-label class="lrc__action__title" *ngIf="this.decodedData.action === 'add_liquidity'">
          {{ 'wallets.wallet_connect.operation_detail.types.liquidity.add_liquidity' | translate }}
        </ion-label>
        <ion-label class="lrc__action__title" *ngIf="this.decodedData.action === 'remove_liquidity'">
          {{ 'wallets.wallet_connect.operation_detail.types.liquidity.remove_liquidity' | translate }}
        </ion-label>
        <ion-label class="lrc__action__info" *ngIf="!this.loading">
          {{ this.symbols[0] }}/{{ this.symbols[1] }}
        </ion-label>

        <ion-spinner color="primary" name="crescent" *ngIf="this.loading"></ion-spinner>
      </div>

      <div class="lrc__container">
        <div class="lrc__container__title">
          <ion-label>
            {{ 'wallets.wallet_connect.operation_detail.date' | translate }}
          </ion-label>
        </div>

        <div class="lrc__container__content lrc__container__date">
          <span>{{ this.dateInfo.date }}</span>
          <span>{{ this.dateInfo.time }} H</span>
        </div>
      </div>
    </div>

    <div class="lrc__container" *ngIf="this.liquidity">
      <div class="lrc__container__title">
        <ion-label>
        {{ 'wallets.wallet_connect.operation_detail.types.liquidity.liquidity' | translate }}
        </ion-label>
      </div>

      <div class="lrc__container__content">
        <ion-label *ngIf="!this.loading">
          {{ this.liquidity }} {{this.symbols[0]}}/{{this.symbols[1]}}
        </ion-label>

        <ion-spinner style="margin-left: 10px" color="primary" name="crescent" *ngIf="this.loading"></ion-spinner>
      </div>
    </div>

    <div class="lrc__container">
      <div class="lrc__container__title">
        <ion-label>
        {{ 'wallets.wallet_connect.operation_detail.types.liquidity.amount_token_0' | translate }}
        </ion-label>
      </div>

      <div class="lrc__container__content">
        <ion-label *ngIf="!this.loading">
          {{ this.amountToken0 }} {{this.symbols[0]}}
        </ion-label>
        <ion-label *ngIf="amountToken0Min && !this.loading" class="lrc__container__content__info">
          ({{ 'wallets.wallet_connect.operation_detail.types.liquidity.amount_to_receive_min' | translate }})
        </ion-label>

        <ion-spinner style="margin-left: 10px" color="primary" name="crescent" *ngIf="this.loading"></ion-spinner>
      </div>
    </div>

    <div class="lrc__container">
      <div class="lrc__container__title">
        <ion-label>
          {{ 'wallets.wallet_connect.operation_detail.types.liquidity.amount_token_1' | translate }}
        </ion-label>
      </div>

      <div class="lrc__container__content">
        <ion-label *ngIf="!this.loading">
          {{ this.amountToken1 }} {{this.symbols[1]}}
        </ion-label>
        <ion-label *ngIf="amountToken1Min  && !this.loading" class="lrc__container__content__info">
          ({{ 'wallets.wallet_connect.operation_detail.types.liquidity.amount_to_receive_min' | translate }})
        </ion-label>

        <ion-spinner style="margin-left: 10px" color="primary" name="crescent" *ngIf="this.loading"></ion-spinner>
      </div>
    </div>
  `,
  styleUrls: ['./liquidity-request.component.scss'],
})
export class LiquidityRequestComponent implements OnInit {
  @Input() request: any;
  @Input() providerSymbol: string;
  @Input() decodedData: any;
  @Input() dateInfo: any;

  public symbols = [];
  public amountToken0;
  public amountToken1;
  public liquidity = null;
  public amountToken0Min = false;
  public amountToken1Min = false;
  public loading = true;

  constructor(
    private walletConnectService: WalletConnectService
  ) { }

  ngOnInit() {
    this.setTokensSymbols();
  }

  async setTokensSymbols() {
    if(!this.decodedData.useNative) {
      const token0Address = this.decodedData.data.filter((data) => data.name === 'tokenA')[0];
      const token1Address = this.decodedData.data.filter((data) => data.name === 'tokenB')[0];
      
      this.symbols[0] = await this.walletConnectService.getTokenSymbol(token0Address.value);
      this.symbols[1] = await this.walletConnectService.getTokenSymbol(token1Address.value);
    } else {
      const tokenAddress = this.decodedData.data.filter((data) => data.name === 'token')[0];
      this.symbols = await this.walletConnectService.getPairTokens(this.request.params[0].to, tokenAddress.value, null);
    }

    this.parseInfo();
    this.setAmountsInfo();

    this.loading = false;
  }

  parseInfo() {
    if (this.decodedData.hasValue) {
      const tokenAmount = this.decodedData.data.filter((data) => data.name === this.decodedData.amount0)[0];

      if (this.symbols[0] === this.walletConnectService.providerSymbol) {
        this.amountToken0 = ethers.utils.formatEther(ethers.BigNumber.from(this.request.params[0].value));
        this.amountToken1 = ethers.utils.formatEther(ethers.BigNumber.from(tokenAmount.value));
      } else {
        this.amountToken1 = ethers.utils.formatEther(ethers.BigNumber.from(this.request.params[0].value));
        this.amountToken0 = ethers.utils.formatEther(ethers.BigNumber.from(tokenAmount.value));
      }
    } else {
      const token0Amount = this.decodedData.data.filter((data) => data.name === this.decodedData.amount0)[0];
      const token1Amount = this.decodedData.data.filter((data) => data.name === this.decodedData.amount1)[0];

      this.amountToken0 = ethers.utils.formatEther(ethers.BigNumber.from(token0Amount.value));
      this.amountToken1 = ethers.utils.formatEther(ethers.BigNumber.from(token1Amount.value));
    }

    const liquidityProvided = this.decodedData.data.filter((data) => data.name === 'liquidity')[0];

    if (liquidityProvided) {
      this.liquidity = ethers.utils.formatEther(ethers.BigNumber.from(liquidityProvided.value));
    }
  }

  setAmountsInfo() {
    if (this.symbols[0] === this.walletConnectService.providerSymbol) {
      this.amountToken0Min = this.decodedData.amount1 === 'amountETHMin';
      this.amountToken1Min = this.decodedData.amount0 === 'amountTokenMin';
    } else if (this.symbols[1] === this.walletConnectService.providerSymbol) {
      this.amountToken0Min = this.decodedData.amount0 === 'amountTokenMin';
      this.amountToken1Min = this.decodedData.amount1 === 'amountETHMin';
    } else {
      this.amountToken0Min = this.decodedData.amount0 === 'amountAMin';
      this.amountToken1Min = this.decodedData.amount1 === 'amountBMin';
    }
  }

}
