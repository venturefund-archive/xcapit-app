import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import SwiperCore, { SwiperOptions, Virtual } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { AuthService } from '../shared-users/services/auth/auth.service';
SwiperCore.use([Virtual]);
@Component({
  selector: 'app-on-boarding',
  template: `
    <div class="ob">
      <app-xcapit-logo divClass="ob__logo" [whiteLogo]="true"></app-xcapit-logo>
      <div>
        <swiper class="ob__swiper" #swiper [config]="this.slideOpts" (slideChange)="onSlideChange()">
          <ng-template swiperSlide *ngFor="let slide of [1, 2, 3]">
            <div class="ob__swiper__slide">
              <img class="ob__swiper__slide__img" [src]="'assets/img/on-boarding/slide-icon-' + slide + '.svg'" />
              <ion-text class="ob__swiper__slide__title ux-font-num-titulo">
                {{ 'users.on_boarding.title_' + slide | translate }}
              </ion-text>
              <ion-text class="ob__swiper__slide__description ux-font-text-base">
                {{ 'users.on_boarding.description_' + slide | translate }}
              </ion-text>
            </div>
          </ng-template>
        </swiper>
        <div class="ob__arrows" [ngClass]="{ ob__arrows_initial: this.isBeginning }">
          <ion-icon *ngIf="!this.isBeginning" name="arrow-back" color="white" (click)="slidePrev()"></ion-icon>
          <ion-icon *ngIf="!this.isEnd" name="arrow-forward" color="white" (click)="slideNext()"></ion-icon>
        </div>
      </div>

      <div class="ob__actions">
        <ion-button
          (click)="goToCreateWallet()"
          name="Create wallet"
          expand="block"
          size="large"
          class="ux_button"
          color="secondary"
        >
          {{ 'users.on_boarding.primary_action' | translate }}
        </ion-button>
        <ion-button
          (click)="goToImportWallet()"
          name="Import wallet"
          expand="block"
          size="large"
          class="ob__actions__secondary ux-link-xl"
          fill="clear"
        >
          {{ 'users.on_boarding.secondary_action' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./on-boarding.page.scss'],
})
export class OnBoardingPage implements OnInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  slideOpts: SwiperOptions = {
    speed: 200,
    spaceBetween: 16,
    slidesPerView: 1,
    virtual: true,
  };
  isBeginning = true;
  isEnd = false;
  constructor(
    private navController: NavController,
    private trackService: TrackService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.removeOldToken();
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_onboarding_screenview',
    });
  }

  private removeOldToken(): void {
    this.authService.logout();
  }

  onSlideChange() {
    this.isBeginning = this.swiper.swiperRef.activeIndex === 0;
    this.isEnd = this.swiper.swiperRef.activeIndex === 2;
  }

  slideNext() {
    this.swiper.swiperRef.slideNext(200);
  }

  slidePrev() {
    this.swiper.swiperRef.slidePrev(200);
  }

  goToCreateWallet() {
    this.navController.navigateForward(['/wallets/create-first/disclaimer']);
  }

  goToImportWallet() {
    this.navController.navigateForward(['/wallets/wallet-imports']);
  }
}
