import { Component, OnInit } from '@angular/core';
import { News } from '../../interfaces/news.interface';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BrowserService } from '../../services/browser/browser.service';
import { LINKS } from 'src/app/config/static-links';

@Component({
  selector: 'app-update-news',
  template: `
    <ion-content class="un">
      <div class="un__header">
        <ion-button
          appTrackClick
          name="Close"
          (click)="this.close()"
          fill="clear"
          size="small"
          color="neutral80"
          class="un__header__close"
        >
          <ion-icon name="close"></ion-icon>
        </ion-button>
        <img [src]="this.image" alt="News image" />
        <ion-text class="ux-font-text-xl un__header__title ion-padding-start ion-padding-end">
          {{ 'shared.update_news.title' | translate }}
        </ion-text>
      </div>

      <div class="un__body">
        <div class="un__body__news-item" *ngFor="let item of items">
          <app-news-item [item]="item" (clicked)="this.navigateToUrl($event)"></app-news-item>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./update-news.component.scss'],
})
export class UpdateNewsComponent implements OnInit {
  links = LINKS;
  image = 'assets/img/update-news/news.svg';
  items: News[] = [
    {
      title: this.translate.instant('shared.update_news.first.title'),
      description: this.translate.instant('shared.update_news.first.description'),
      url: ['/tabs/wallets'],
      isOpenByBrowser: false,
    },
    {
      title: this.translate.instant('shared.update_news.second.title'),
      description: this.translate.instant('shared.update_news.second.description'),
      url: ['/contacts/home'],
      isOpenByBrowser: false,
    },
    {
      title: this.translate.instant('shared.update_news.third.title'),
      description: this.translate.instant('shared.update_news.third.description'),
      url: ['/fiat-ramps/bitrefill/token-selection'],
      isOpenByBrowser: false,
    },
  ];
  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private translate: TranslateService,
    private browserService: BrowserService
  ) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }

  navigateToUrl(item: News) {
    if (item.isOpenByBrowser) {
      this.browserService.open({ url: item.url[0] });
      this.close();
    } else {
      this.navController.navigateForward(item.url);
      this.close();
    }
  }
}
