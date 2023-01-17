import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { CAUSES } from '../shared-donations/constants/causes';

@Component({
  selector: 'app-description-cause',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button class="content__back" defaultHref="/donations/causes"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'donations.description_cause.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="ux_main">
        <app-cause-info [data]="this.data"></app-cause-info>
      </div>
    </ion-content>
    <ion-footer>
      <div class="dc__content__button ion-padding">
        <ion-button
          class="ux_button"
          appTrackClick
          name="ux_donations_donate"
          color="secondary"
          expand="block"
          (click)="this.goToDonate()"
        >
          {{ 'donations.description_cause.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./description-cause.page.scss'],
})
export class DescriptionCausePage implements OnInit {
  cause: string;
  data;
  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
  ) {}

  ngOnInit() {
    this.cause = this.route.snapshot.queryParamMap.get('cause');
    this.data = CAUSES.find((cause) => cause.id === this.cause);
  }

  async goToDonate() {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          cause: this.cause,
        },
      };
      this.navController.navigateForward(['/donations/token-selection'], navigationExtras);
  }
}
