import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expandable-investment-info',
  template: `
    <ion-accordion-group class="eif">
      <ion-accordion class="eif__accordion" value="investment-info">
        <ion-item slot="header" class="eif__accordion__header">
          <div class="eif__accordion__header__content">
            <div class="eif__accordion__header__content__img">
              <img src="assets/img/coins/USDC.png" />
            </div>
            <div class="eif__accordion__header__content__text">
              <ion-label>
                <ion-text class="ux-font-text-lg">USDC</ion-text>
                <ion-text class="ux-font-text-base">USD Coin</ion-text>
              </ion-label>
              <ion-badge class="ux-font-num-subtitulo">
                2.6{{ 'defi_investments.shared.expandable_investment_info.annual' | translate }}
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
          <ion-item>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs ">{{
                'defi_investments.shared.expandable_investment_info.TVL' | translate
              }}</ion-text>
              <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">$158,551,23</ion-text>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs ">{{
                'defi_investments.shared.expandable_investment_info.protocol_type' | translate
              }}</ion-text>
              <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">Vault</ion-text>
            </ion-label>
          </ion-item>
          <ion-item class="split-information-item">
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs ">{{
                'defi_investments.shared.expandable_investment_info.deposit_asset' | translate
              }}</ion-text>
              <div class="inline-image">
                <img src="assets/img/coins/USDC.png" />
                <ion-text class="eif__accordion__content__information-item__text ux-font-text-base ">USDC</ion-text>
              </div>
            </ion-label>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs">{{
                'defi_investments.shared.expandable_investment_info.receive_asset' | translate
              }}</ion-text>
              <div class="inline_image">
                <img src="assets/img/coins/USDC.png" />
                <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">USDC</ion-text>
              </div>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs">Blockchain</ion-text>
              <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">Polygon</ion-text>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label class="eif__accordion__content__information-item">
              <ion-text class="eif__accordion__content__information-item__label ux-font-titulo-xs ">{{
                'defi_investments.shared.expandable_investment_info.platform' | translate
              }}</ion-text>
              <ion-text class="eif__accordion__content__information-item__text ux-font-text-base">2PI</ion-text>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-accordion>
    </ion-accordion-group>
  `,
  styleUrls: ['./expandable-investment-info.component.scss'],
})
export class ExpandableInvestmentInfoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
