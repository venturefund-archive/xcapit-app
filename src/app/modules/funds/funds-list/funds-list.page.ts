import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-funds-list',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ 'funds.funds_list.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <ion-button
          type="button"
          expand="full"
          size="large"
          color="success"
          [routerLink]="['/tutorials/interactive-tutorial']"
        >
          <ion-icon slot="start" name="add"></ion-icon>
          {{ 'funds.funds_list.new_fund_button' | translate }}
        </ion-button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./funds-list.page.scss']
})
export class FundsListPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
