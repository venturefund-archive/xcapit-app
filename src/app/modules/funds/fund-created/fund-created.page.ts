import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fund-created',
  template: `
    <div class="app_header_trama">

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
