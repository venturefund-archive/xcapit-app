import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-linked-apikeys',
  template: `
    <div class="app_header_trama">
      <app-header-trama mode="success">
        <div class="app_header_trama__header_title">
          <ion-text
            class="app_header_trama__header_title__title_text ion-text-center"
          >
            <h1>
              {{ 'apikeys.linked_apikeys.title_header_text' | translate }}
            </h1>
          </ion-text>
          <ion-text
            class="app_header_trama__header_title__subtitle_text ion-text-center"
          >
            <h4>
              {{ 'apikeys.linked_apikeys.subtitle_header_text' | translate }}
            </h4>
          </ion-text>
        </div>
      </app-header-trama>
    </div>
    <ion-content class="ion-padding">
      <div class="linked_apikeys_content">
        <div class="linked_apikeys_content__description">
          <ion-text color="xmedium">
            <p class="ion-text-justify">
              {{ 'apikeys.linked_apikeys.description_text' | translate }}
            </p>
          </ion-text>
        </div>
        <div class="linked_apikeys_content__create_fund_button">
          <ion-button
            appTrackClick
            name="Create Fund"
            expand="block"
            color="xcprimary"
            routerLink="/tutorials/interactive-tutorial"
          >
            {{ 'apikeys.linked_apikeys.create_fund_button_text' | translate }}
          </ion-button>
        </div>
        <div>
          <ion-button
            appTrackClick
            name="Create Fund Later"
            fill="clear"
            color="xcprimary"
            routerLink="/tabs/funds"
          >
            {{
              'apikeys.linked_apikeys.create_fund_later_button_text' | translate
            }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./linked-apikeys.page.scss']
})
export class LinkedApikeysPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
