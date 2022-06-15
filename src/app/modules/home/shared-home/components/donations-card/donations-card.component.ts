import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Component({
  selector: 'app-donations-card',
  template:`
  <div class="dc" name="ux_donations_go" (click)="this.goToDonations()">
    <div class="dc__content">
      <div class="dc__content__body">
        <ion-text class="ux-font-text-lg dc__content__body__title">
          {{ 'home.home_page.donations_card.title' | translate }}
        </ion-text>
        <ion-text class="ux-font-text-xxs dc__content__body__subtitle">
          {{ 'home.home_page.donations_card.subtitle' | translate }}
        </ion-text>
      </div>
      <img class="dc__content__img" src="a"/>
    </div>
  </div>`,
  styleUrls: ['./donations-card.component.scss'],
})
export class DonationsCardComponent implements OnInit {

  constructor(private navController: NavController, private storage: IonicStorageService) { }

  ngOnInit() {}

  async goToDonations() {
    const introductionCompleted = await this.storage.get('donationsIntroductionCompleted');
    const url = !introductionCompleted ? 'donations/information' : 'donations/causes';
    this.navController.navigateForward([url]);
  }
}
