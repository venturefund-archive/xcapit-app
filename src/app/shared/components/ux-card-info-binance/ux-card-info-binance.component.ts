import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;
@Component({
  selector: 'app-ux-card-info-binance',
  template: `
    <div class="cib " (click)="this.moreInfo()">
      <div class="cib__main">
        <div class="cib__main__content ion-padding">
          <div
            class="cib__main__content__title ux-font-gilroy ux-fweight-extrabold ux-fsize-22"
          >
            <ion-text color="uxdark">{{
              'shared.card_info_binance.title' | translate
            }}</ion-text>
          </div>
          <div
            class="cib__main__content__text ux-font-lato ux-fweight-regular ux-fsize-14"
            color="uxdark"
          >
            <ion-text>{{
              'shared.card_info_binance.content' | translate
            }}</ion-text>
          </div>
        </div>
        <div class="cib__main__image">
          <ion-img
            src="assets/img/fund-list/binance.svg"
            alt="Binance logo"
          ></ion-img>
        </div>
      </div>

      <div class="cib__footer">
        <ion-button
          appTrackClick
          name="More Info"
          fill="clear"
          size="small"
          class="cib__footer__more_info ux-font-lato ux-fweight-semibold ux-fsize-14"
        >
          {{ 'shared.card_info_binance.action' | translate }}
          <ion-icon slot="end" name="ux-forward"></ion-icon>
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./ux-card-info-binance.component.scss']
})
export class UxCardInfoBinanceComponent implements OnInit {
  constructor(private navController: NavController) {
    Browser.prefetch({
      urls: ['https://www.info.xcapit.com/']
    });
  }

  ngOnInit() {}

  async moreInfo() {
    await Browser.open({ toolbarColor:"#ff9100", url: 'https://www.info.xcapit.com/' });
  }
}
