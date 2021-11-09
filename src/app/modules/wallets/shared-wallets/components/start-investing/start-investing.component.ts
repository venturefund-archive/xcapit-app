import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start-investing',
  template: `
    <ion-card class="si">
      <div class="ion-padding">
        <div class="si__title">
          <ion-text class="ux-font-text-lg">
            {{ 'wallets.shared_wallets.start_investing_card.title' | translate }}
          </ion-text>
        </div>
        <div class="si__link">
          <ion-text class="ux-font-link-xl">
            {{ 'wallets.shared_wallets.start_investing_card.text' | translate }}
          </ion-text>
        </div>
      </div>
    </ion-card>
  `,
  styleUrls: ['./start-investing.component.scss'],
})
export class StartInvestingComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
