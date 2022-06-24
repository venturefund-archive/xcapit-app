import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-amount-input-card-skeleton',
  template: `
    <div class="aic ion-padding">
      <div class="aic__available text-center">
        <ion-skeleton-text animated class="aic__available__title"></ion-skeleton-text>
        <ion-skeleton-text animated class="aic__available__amount"></ion-skeleton-text>
        <ion-skeleton-text animated class="aic__available__quote-amount"></ion-skeleton-text>
      </div>
      <div class="aic__content">
        <ion-skeleton-text animated class="aic__content__title"></ion-skeleton-text>
        <ion-skeleton-text animated *ngIf="this.showRange" class="aic__content__percentage"></ion-skeleton-text>
        <ion-skeleton-text animated *ngIf="this.showRange" class="aic__content__range"></ion-skeleton-text>

        <div class="aic__content__inputs">
          <div class="aic__content__inputs__wrapper">
            <ion-skeleton-text animated class="aic__content__inputs__wrapper__label"></ion-skeleton-text>
            <ion-skeleton-text animated class="aic__content__inputs__wrapper__input"></ion-skeleton-text>
          </div>
          <div class="aic__content__inputs__wrapper">
            <ion-skeleton-text animated class="aic__content__inputs__wrapper__label"></ion-skeleton-text>
            <ion-skeleton-text animated class="aic__content__inputs__wrapper__input"></ion-skeleton-text>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./amount-input-card-skeleton.component.scss'],
})
export class AmountInputCardSkeletonComponent implements OnInit {
  @Input() showRange: boolean;
  constructor() { }

  ngOnInit() {}

}
