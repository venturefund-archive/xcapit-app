import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-defi-investment-product-skeleton',
  template: `
    <div class="skl_dip">
      <div class="skl_dip__content">
        <div class="skl_dip__content__content_1">
          <div class="skl_dip__content__content_1__avatar">
            <ion-avatar slot="start">
              <ion-skeleton-text animated></ion-skeleton-text>
            </ion-avatar>
          </div>
          <div class="skl_dip__content__content_1__title_and_subtitle">
            <ion-skeleton-text class="skl_dip__content__content_1__title_and_subtitle__title" style="width:50%" animated></ion-skeleton-text>
            <div class="skl_dip__content__content_1__subtitle">
                <ion-skeleton-text class="subtitle" style="width:35%" animated></ion-skeleton-text>
            </div>
          </div>
        </div>
        <div class="skl_dip__content__content_2">
          <ion-skeleton-text animated></ion-skeleton-text>
          <ion-skeleton-text animated></ion-skeleton-text>
        </div>
        <div class="skl_dip__content__content_3">
          <div class="skl_dip__content__content_3__label_1">
            <ion-skeleton-text animated></ion-skeleton-text>
          </div>
          <div class="skl_dip__content__content_3__label_2">
            <ion-skeleton-text animated></ion-skeleton-text>
          </div>
        </div>
      </div>
      <div class="skl_dip__footer">
        <div class="skl_dip__footer__info">
            <ion-skeleton-text animated></ion-skeleton-text>
            <ion-skeleton-text animated></ion-skeleton-text>
        </div>
        <div class="skl_dip__footer__button ">
        <ion-skeleton-text animated></ion-skeleton-text>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./defi-investment-product-skeleton.component.scss'],
})
export class DefiInvestmentProductSkeletonComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
