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
              <ion-label color="uxdark" class="article-name ux-font-text-base">{{ article.name }}</ion-label>
            </div>
            <div>
              <ion-label color="uxregular" class="article-summary ux-font-text-xxs">{{ article.summary }}</ion-label>
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
    spaceBetween: 10,
  };
  constructor() {}

  ngOnInit() {}

  async goToWeb(slug) {
    await Browser.open({ toolbarColor: '#ff9100', url: `https://www.xcapit.com/xcapit-academy/${slug}` });
  }
}
