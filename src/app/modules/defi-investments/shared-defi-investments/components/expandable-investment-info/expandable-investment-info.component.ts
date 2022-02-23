import { InvestmentProduct } from './../../interfaces/investment-product.interface';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expandable-investment-info',
  template: `
    <ion-accordion-group class="eif">
      <ion-accordion class="eif__accordion" value="investment-info">
        <ion-item slot="header" class="eif__accordion__header">
          <div class="eif__accordion__header__content">
            <div class="eif__accordion__header__content__img">
              <img [src]="this.token.logoRoute" />
            </div>
            <div class="eif__accordion__header__content__text">
              <ion-label>
                <ion-text
                  *ngIf="this.token.name"
                  class="eif__accordion__header__content__text__token-symbol ux-font-text-lg"
                  >{{ (this.token.name | splitString: ' - ')[0] }}</ion-text
                >
                <ion-text
                  *ngIf="this.token.name"
                  class="eif__accordion__header__content__text__token-name ux-font-text-base"
                  >{{ (this.token.name | splitString: ' - ')[1] }}</ion-text
                >
              </ion-label>
              <ion-badge class="ux-font-num-subtitulo">
                {{ this.apy | number: '1.2-2'
                }}{{ 'defi_investments.shared.expandable_investment_info.annual' | translate }}
              </ion-badge>
            </div>
          </div>
          <ion-icon
            slot="end"
            name="chevron-down"
            class="ion-accordion-toggle-icon"
            aria-hidden="true"
            role="img"
          ></ion-icon>
        </ion-item>
        <ion-list lines="none" slot="content" class="eif__accordion__content">
          <!-- <ion-item>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs ">
                {{ 'defi_investments.shared.expandable_investment_info.TVL' | translate }}
              </ion-text>
              <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">
                {{ '$' }}{{ this.tvl | number: '1.2-2' }}
              </ion-text>
            </ion-label>
          </ion-item> -->
          <ion-item>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs ">
                {{ 'defi_investments.shared.expandable_investment_info.protocol_type' | translate }}
              </ion-text>
              <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">
                {{ this.type }}
              </ion-text>
            </ion-label>
          </ion-item>
          <ion-item class="split-information-item">
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs ">
                {{ 'defi_investments.shared.expandable_investment_info.deposit_asset' | translate }}
              </ion-text>
              <div class="inline-image">
                <img [src]="this.token.logoRoute" />
                <ion-text class="eif__accordion__content__information-item__text ux-font-text-base ">
                  {{ this.token.value }}
                </ion-text>
              </div>
            </ion-label>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs">
                {{ 'defi_investments.shared.expandable_investment_info.receive_asset' | translate }}
              </ion-text>
              <div class="inline-image">
                <img [src]="this.token.logoRoute" />
                <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">
                  {{ this.token.value }}
                </ion-text>
              </div>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs">
                {{ 'defi_investments.shared.expandable_investment_info.blockchain' | translate }}
              </ion-text>
              <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">{{
                this.token.network !== 'MATIC' ? this.token.network : 'Polygon'
              }}</ion-text>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs ">
                {{ 'defi_investments.shared.expandable_investment_info.platform' | translate }}
              </ion-text>
              <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">
                {{ this.provider }}
              </ion-text>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-accordion>
    </ion-accordion-group>
  `,
  styleUrls: ['./expandable-investment-info.component.scss'],
})
export class ExpandableInvestmentInfoComponent implements OnInit {
  @Input() investmentProduct: InvestmentProduct;
  token: Coin;
  tvl: number;
  apy: number;
  provider: string;
  type: string;

  constructor() {}

  ngOnInit() {
    this.token = this.investmentProduct.token();
    this.tvl = this.investmentProduct.tvl();
    this.apy = this.investmentProduct.apy();
    this.provider = this.investmentProduct.provider();
    this.type = this.investmentProduct.type();
  }
}
