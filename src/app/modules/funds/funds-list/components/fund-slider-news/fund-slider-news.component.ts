import { Component, OnInit, Input } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;

@Component({
  selector: 'app-fund-slider-news',
  template: `
    <ion-slides pager="false" [options]="slideOpts">
      <ion-slide class="fsn" *ngFor="let article of news" (click)="this.goToWeb(article.slug)">
        <div class="fsn__main">
          <img src="{{ article.image.url }}" alt="" />
          <div class="fsn__main__info">
            <div>
              <ion-label
                color="uxdark"
                class="ux-font-gilroy ux-fweight-bold ux-fsize-16"
                >{{ article.name }}</ion-label
              >
            </div>
            <div>
              <ion-label
                color="uxregular"
                class="ux-font-lato ux-fweight-semibold ux-fsize-12"
                >{{ article.summary }}</ion-label
              >
            </div>
          </div>
        </div>
      </ion-slide>
    </ion-slides>
  `,
  styleUrls: ['./fund-slider-news.component.scss'],
})
export class FundSliderNewsCardComponent implements OnInit {
  @Input() news: any;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.25,
    spaceBetween: 10
  };
  constructor() {}

  ngOnInit() {
  }

  async goToWeb(slug){
    await Browser.open({ toolbarColor:"red", url: `https://www.xcapit.com/xcapit-academy/${slug}` });
  }
}
