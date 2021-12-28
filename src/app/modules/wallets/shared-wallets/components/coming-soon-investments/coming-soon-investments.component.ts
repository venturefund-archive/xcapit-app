import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coming-soon-investments',
  template: `
    <ion-card class="cs ux-card-new ion-no-margin ion-padding" name="Coming Soon Wallet Card">
      <div class="cs__img">
        <img src="assets/img/wallets/coming-soon.svg" alt="Coming Soon" />
      </div>
      <div class="cs__title">
        <ion-text class="ux-font-text-xl">
          {{ 'wallets.shared_wallets.coming_soon_card.title' | translate }}
        </ion-text>
      </div>
      <div class="cs__text">
        <ion-text class="ux-font-text-base">
          {{ 'wallets.shared_wallets.coming_soon_card.text' | translate }}
        </ion-text>
      </div>
    </ion-card>
  `,
  styleUrls: ['./coming-soon-investments.component.scss'],
})
export class ComingSoonInvestmentsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
