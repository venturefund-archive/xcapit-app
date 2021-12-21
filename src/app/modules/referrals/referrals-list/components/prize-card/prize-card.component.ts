import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastAlertComponent } from 'src/app/shared/components/new-toasts/toast-alert/toast-alert.component';

@Component({
  selector: 'app-prize-card',
  template: ` <div class="pcc">
    <div class="pcc__content">
      <div class="pcc__content__left">
        <div class="prizes">
          <ion-text class="ux-font-text-base">{{ '$' + this.accumulatedMoney }}</ion-text>
        </div>
      </div>
      <div class="pcc__content__right">
        <ion-button name="Send Email" (click)="this.sendEmail()" appTrackClick fill="clear" size="small"
          >{{ 'referrals.new_referral_page.prize_card.prize_button' | translate }}
          <ion-icon class="pcc__content__right__icon" slot="end" color="info" name="ux-forward"></ion-icon>
        </ion-button>
      </div>
    </div>
  </div>`,
  styleUrls: ['./prize-card.component.scss'],
})
export class PrizeCardComponent implements OnInit {
  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}
  accumulatedMoney = 0;
  ngOnInit() {}

  sendEmail() {
    if (this.accumulatedMoney > 0) {
      this.navController.navigateForward(['/referrals/success-claim']);
    } else {
      this.openModalAlert();
    }
  }

  async openModalAlert() {
    const modal = await this.modalController.create({
      component: ToastAlertComponent,
      cssClass: 'ux-alert',
      showBackdrop: false,
      componentProps: {
        title: this.translate.instant('referrals.new_referral_page.prize_card.modal_info'),
        type: 'error',
      },
    });
    await modal.present();
    setTimeout(() => {
      modal.dismiss();
    }, 3000);
  }
}
