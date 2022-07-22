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
          <div class="skl_dip__content__content_2">
            <div class="skl_dip__content__content_2__title_and_subtitle">
              <ion-skeleton-text
                class="skl_dip__content__content_2__title_and_subtitle__title"
                animated
              ></ion-skeleton-text>
              <div class="skl_dip__content__content_2__subtitle">
                <ion-skeleton-text class="subtitle" animated></ion-skeleton-text>
              </div>
              <div class="skl_dip__content__content_2__subtitle__2">
                <ion-skeleton-text animated></ion-skeleton-text>
              </div>
            </div>
            <div class="skl_dip__content__content_2__amount">
              <div class="skl_dip__content__content_2__amount_1">
                <ion-skeleton-text  animated></ion-skeleton-text>
              </div>
              <div class="skl_dip__content__content_2__amount_2">
                <ion-skeleton-text  animated></ion-skeleton-text>
              </div>
            </div>
          </div>
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
