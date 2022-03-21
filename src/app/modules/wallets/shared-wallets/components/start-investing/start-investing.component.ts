import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-start-investing',
  template: `
    <ion-card class="si ion-no-margin" name="Start Investing Card">
      <div class="ion-padding">
        <div class="si__title">
          <ion-text class="ux-font-text-lg">
            {{ 'wallets.shared_wallets.start_investing_card.title' | translate }}
          </ion-text>
        </div>
        <div class="si__link">
          <ion-button
            fill="clear"
            class="ux-link-xl ion-no-padding"
            name="Start Investing Button"
            appTrackClick
            (click)="this.goToStartInvestingPage()"
          >
            {{ 'wallets.shared_wallets.start_investing_card.text' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-card>
  `,
  styleUrls: ['./start-investing.component.scss'],
})
export class StartInvestingComponent implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToStartInvestingPage() {
    this.navController.navigateForward(['tabs/investments']);
  }
}
