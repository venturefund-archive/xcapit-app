import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fund-created',
  template: `
    <div class="app_header_trama">
      <app-header-trama mode="success">
        <div class="app_header_trama__header_title">
          <ion-text
            class="app_header_trama__header_title__title_text ion-text-center"
          >
            <h1>
              {{ 'funds.fund_created.congrats_header_text' | translate }}
            </h1>
          </ion-text>
          <ion-text
            class="app_header_trama__header_title__subtitle_text ion-text-center"
          >
            <h4>
              {{ 'funds.fund_created.subtitle_header_text' | translate }}
            </h4>
          </ion-text>
        </div>
      </app-header-trama>
    </div>
    <ion-content class="ion-padding">
      <div class="fund_created_content">
        <div class="fund_created_content__description">
          <ion-text color="xmedium">
            <p class="ion-text-justify">
              {{ 'funds.fund_created.description_text' | translate }}
            </p>
          </ion-text>
        </div>
        <div class="fund_created_content__go_to_fund_button">
          <ion-button
            appTrackClick
            name="Go To Fund"
            expand="block"
            size="large"
            color="xcprimary"
            routerLink="/tabs/funds"
          >
            {{ 'funds.fund_created.go_to_fund_button_text' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-created.page.scss']
})
export class FundCreatedPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
