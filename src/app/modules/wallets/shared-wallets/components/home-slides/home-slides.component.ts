import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import SwiperCore, { SwiperOptions, Virtual } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Virtual]);
@Component({
  selector: 'app-home-slides',
  template: `
    <div class="hs" >
      <swiper class="hs__swiper"  #swiper [config]="this.slideOpts">
        <ng-template swiperSlide *ngFor="let slide of [0, 1, 2]; let i = index">
          <div class="hs__swiper__slide" (click)="this.selectSlide(slide, i)">
            <img class="hs__swiper__slide__img" [src]="this.slides[slide].image"/>
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
    initialSlide:2,
    speed: 200,
    spaceBetween: 12,
    slidesPerView: 1.2,
    centeredSlides: true,
    loop:true
  };

  constructor(private browserService: BrowserService, private navController: NavController, private trackService: TrackService) {}

  ngOnInit() {
  }

  selectSlide(slide , index){
    this.sendEvent(index);
    this.navigateTo(slide);
  }

  sendEvent(index){
    this.trackService.trackEvent({
      eventLabel: `ux_banner0${index}`,
    });
  }

  async navigateTo(slide){
    const url = this.slides[slide].url;
    if(this.slides[slide].isBrowserOpen){
     await this.browserService.open({ url: url });
    }else{
      this.navController.navigateForward(url)
    }
  }

}