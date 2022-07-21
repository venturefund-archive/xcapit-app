import { Component, Input, OnInit } from '@angular/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';

@Component({
  selector: 'app-cause-info',
  template: ` <div class="dc__content">
      <div class="dc__content__img">
        <img [src]="this.data.image" />
      </div>
    </div>
    <div class="dc__content__card">
      <div class="dc__content__card__body">
        <div class="dc__content__card__body__image">
          <img class="dc__content__card__image__img" [src]="this.data.logo" alt="Product Image" />
        </div>
        <div class="dc__content__card__information">
          <div class="dc__content__card__information__text">
            <ion-text class="ux-font-header-titulo text"> {{ this.data.title | translate }}</ion-text>
            <ion-text class="ux-font-text-xs neutral">{{ this.data.scope | translate }}</ion-text>
            <ion-badge
              class="ux-font-num-subtitulo ux-badge-coming dc__content__card__information__group__badge"
              slot="end"
              >{{ this.badge | translate }}
            </ion-badge>
          </div>
          <div class="dc__content__card__information__icon-text" *ngIf="this.tokenLogo">
            <img class="dc__content__card__image__img" [src]="this.tokenLogo" alt="Product Image" />
            <ion-text class="ux-font-text-xxs" color="neutral80">{{
              'donations.description_cause.info.receive' | translate
            }}</ion-text>
          </div>
        </div>
      </div>
    </div>
    <div class="ion-padding">
      <div class="dc__content__general-title">
        <ion-text class="ux-font-header-titulo text">{{ this.data.title_1 | translate }} </ion-text>
      </div>
      <div class="dc__content__subtitle">
        <ion-text class="ux-font-header-titulo text">{{ this.data.title_2 | translate }}</ion-text>
      </div>
      <div class="dc__content__description">
        <ion-text class="ux-font-text-base-primary">{{ this.data.description | translate }}</ion-text>
      </div>
      <div class="dc__content__social-media">
        <ion-text class="ux-font-header-titulo text">{{ this.data.title_3 | translate }}</ion-text>
      </div>
      <div class="dc__content__links">
        <div class="dc__content__links__link" *ngFor="let media of this.data.social_media">
          <ion-icon [name]="media.logo"></ion-icon>
          <ion-button fill="clear" name="link_to_social_media" (click)="this.browseTo(media.link)" class="ux-link-xs">{{
            media.text
          }}</ion-button>
        </div>
      </div>
    </div>`,
  styleUrls: ['./cause-info.component.scss'],
})
export class CauseInfoComponent implements OnInit {
  @Input() data;
  badge: string;
  tokenLogo: string;
  constructor(private browserService: BrowserService) {}

  ngOnInit() {
    this.setType();
    this.setTokenLogo();
  }

  private setTokenLogo() {
    this.tokenLogo = `assets/img/coins/donation/${this.data.token.value}.svg`;
  }

  setType() {
    this.badge = `donations.causes.types.${this.data.type}`;
  }

  async browseTo(link) {
    await this.browserService.open({ url: link });
  }
}
