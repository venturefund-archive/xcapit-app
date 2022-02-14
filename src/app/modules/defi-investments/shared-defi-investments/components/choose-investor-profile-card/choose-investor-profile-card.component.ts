import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-choose-investor-profile-card',
  template: `
    <ion-card class="cipc">
      <div class="cipc__title">
        <ion-text class="ux-font-header-titulo">
          {{ this.titleText | translate }}
        </ion-text>
      </div>
      <div class="cipc__text">
        <ion-text class="ux-font-text-xs">
          {{ this.descriptionText | translate }}
        </ion-text>
      </div>
      <div class="cipc__button_primary">
        <ion-button class="ux_button ion-no-padding" size="small" color="uxsecondary">
          {{ this.buttonPrimaryText | translate }}
        </ion-button>
      </div>
      <div class="cipc__button_secondary">
        <ion-button class="ux_button ion-no-padding" size="small" fill="clear" color="primary">
          {{ this.buttonSecondaryText | translate }}
        </ion-button>
      </div>
    </ion-card>
  `,
  styleUrls: ['./choose-investor-profile-card.component.scss'],
})
export class ChooseInvestorProfileCardComponent implements OnInit {
  titleText: string = 'defi_investments.defi_investment_products.choose_investor_profile.completed_test.title';
  descriptionText: string = 'defi_investments.defi_investment_products.choose_investor_profile.completed_test.description';
  buttonPrimaryText: string = 'defi_investments.defi_investment_products.choose_investor_profile.completed_test.button_primary';
  buttonSecondaryText: string = 'defi_investments.defi_investment_products.choose_investor_profile.completed_test.button_secondary';
  constructor() {}

  ngOnInit() {}
}
