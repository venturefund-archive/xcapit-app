import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-investment-info',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="funds/fund-investment"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'funds.fund_investment.header_more_about' | translate }} {{ this.strategyData?.name }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content">
          <div class="info">
            <ion-text class="name ux-font-gilroy ux-fweight-bold ux-fsize-15" color="neutral90">
              {{ this.strategyData?.name }}
            </ion-text>
            <ion-text class="description ux-font-lato ux-fweight-regular ux-fsize-15" color="neutral90">
              {{ this.strategyData?.description | translate }}
            </ion-text>
          </div>
        </div>
        <div class="ux_footer ">
          <div class="button-next">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Invest Info Page"
              type="submit"
              color="secondary"
              size="large"
              (click)="this.navigateToCreateFund()"
            >
              {{ 'funds.fund_investment_info.invest_button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./fund-investment-info.page.scss'],
})
export class FundInvestmentInfoPage implements OnInit {
  selectedStrategy: string;

  strategyData = {
    name: '',
    description: '',
  };

  strategy = {
    Denali: {
      name: 'Denali',
      description: 'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.info_description',
    },
    Olympus: {
      name: 'Olympus Mons',
      description: 'funds.fund_investment.card.profiles.volume_profile_strategies_BTC.info_description',
    },
    Andes: { name: 'Andes', description: 'funds.fund_investment.card.profiles.Mary_index.info_description' },
    Himalayas: { name: 'Himalayas', description: 'funds.fund_investment.card.profiles.DeFi_index.info_description' },
    Oasis: {
      name: 'Oasis',
      description: 'funds.fund_investment.card.profiles.Metaverse_index.info_description',
    },
  };

  constructor(private route: ActivatedRoute, private navController: NavController) {
    this.selectedStrategy = this.route.snapshot.paramMap.get('strategy');
  }

  ngOnInit() {
    this.setStrategyData();
  }

  setStrategyData() {
    this.strategyData = {
      ...this.strategy[this.selectedStrategy],
    };
  }

  navigateToCreateFund() {
    this.navController.navigateForward('/apikeys/list');
  }
}
