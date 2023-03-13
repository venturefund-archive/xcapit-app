import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LINKS } from 'src/app/config/static-links';
import { GeneralModalWithTwoButtonsComponent } from 'src/app/shared/components/general-modal-with-two-buttons/general-modal-with-two-buttons.component';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import SwiperCore, { SwiperOptions, Virtual } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Virtual]);
@Component({
  selector: 'app-home-slides',
  template: `
    <div class="hs">
      <swiper class="hs__swiper" #swiper [config]="this.slideOpts" [loopedSlides]="this.slides.length">
        <ng-template swiperSlide *ngFor="let slide of this.slides; let i = index">
          <div class="hs__swiper__slide" (click)="this.selectSlide(slide, i)">
            <img class="hs__swiper__slide__img" [src]="slide.image" />
          </div>
        </ng-template>
      </swiper>
    </div>
  `,

  styleUrls: ['./home-slides.component.scss'],
})
export class HomeSlidesComponent implements OnInit {
  @Input() slides;
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  slideOpts: SwiperOptions = {
    initialSlide: 1,
    speed: 200,
    spaceBetween: 12,
    slidesPerView: 1.2,
    centeredSlides: true,
    loop: true,
  };

  constructor(
    private browserService: BrowserService,
    private navController: NavController,
    private trackService: TrackService,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  selectSlide(slide, index) {
    this.sendEvent(index);
    this.open(slide);
  }

  sendEvent(index) {
    this.trackService.trackEvent({
      eventLabel: `ux_banner0${index}`,
    });
  }

  async open(_aSlide) {
    if (_aSlide.isModalOpen) {
      this.warrantyOptions();
    } else {
      this.navigateTo(_aSlide);
    }
  }

  async navigateTo(slide) {
    const url = slide.url;
    if (slide.isBrowserOpen) {
      await this.browserService.open({ url: url });
    } else {
      this.navController.navigateBack(url);
    }
  }

  async warrantyOptions() {
    const modal = await this.modalController.create({
      component: GeneralModalWithTwoButtonsComponent,
      cssClass: 'modal',
      backdropDismiss: false,
      componentProps: {
        highlightedHeader: this.translate.instant('warranty.modal_info.highlightedHeader'),
        header: this.translate.instant('warranty.modal_info.header'),
        information: this.translate.instant('warranty.modal_info.information'),
        link: LINKS.naranjax,
        firstButton: this.translate.instant('warranty.modal_info.firstButton'),
        eventFirstButton: 'ux_warranty_start',
        secondButton: this.translate.instant('warranty.modal_info.secondButton'),
        eventSecondButton: 'ux_warranty_withdraw',
      },
    });

    await modal.present();
  }
}
