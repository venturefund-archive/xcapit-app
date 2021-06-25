import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-prize-card',
  template: ` <div class="pcc">
    <div class="pcc__content">
      <div class="pcc__content__left">
        <div class="prizes">
          <ion-text class="ux-font-lato ux-fweight-bold ux-fsize-14" color="uxsemidark">$0</ion-text>
        </div>
      </div>
      <div class="pcc__content__right">
        <ion-button name="Send Email" (click)="this.sendEmail()" appTrackClick fill="clear" size="small"
          >{{ 'referrals.new_referral_page.prize_card.prize_button' | translate }}
          <ion-icon class="pcc__content__right__icon" slot="end" name="ux-forward"></ion-icon>
        </ion-button>
      </div>
    </div>
  </div>`,
  styleUrls: ['./prize-card.component.scss'],
})
export class PrizeCardComponent implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  sendEmail() {
    this.navController.navigateForward(['/referrals/success-claim']);
  }
}
