import { Component, OnInit, Input } from '@angular/core';
import { BrowserService } from '../../services/browser/browser.service';

@Component({
  selector: 'app-slider-news',
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
  styleUrls: ['./slider-news.component.scss'],
})
export class SliderNewsCardComponent implements OnInit {
  @Input() news: any;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.25,
    spaceBetween: 10,
  };
  constructor(private browserService: BrowserService) {}

  ngOnInit() {}

  async goToWeb(slug) {
    await this.browserService.open({ url: `https://www.xcapit.com/xcapit-academy/${slug}` });
  }
}
