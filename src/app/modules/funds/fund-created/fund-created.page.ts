import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fund-created',
  template: `
    <div class="app_header_trama">
      <app-header-trama mode="success">
        <div class="header_title">
          <ion-label class="title">{{
            'funds.fund_created.congrats_header_text' | translate
          }}</ion-label>
          <ion-label class="subtitle">{{
            'funds.fund_created.subtitle_header_text' | translate
          }}</ion-label>
        </div>
      </app-header-trama>
    </div>
    <ion-content class="ion-padding">
      <div class="fund_created_content">
        <p class="ion-text-justify" color="xcprimary">
          {{ 'funds.fund_created.description_text' | translate }}
        </p>
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
    </ion-content>
  `,
  styleUrls: ['./fund-created.page.scss']
})
export class FundCreatedPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
