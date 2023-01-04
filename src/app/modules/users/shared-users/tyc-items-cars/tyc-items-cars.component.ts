import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tyc-items-cars',
  template: `<ion-item
    appTrackClick
    (click)="navigateTo()"
    lines="none"
    class="ion-no-padding ursc"

  >
    <div class="ursc__wrapper">
      <div class="ursc__wrapper__step">
        <div>
          <img [src]="this.items.img">
        </div>
      </div>
      <div class="ursc__wrapper__content">
        <ion-text class="ursc__wrapper__content__title ux-font-text-lg">{{ this.items.title | translate }}</ion-text>
        <div class="subtitle">
          <ion-text class="ursc__wrapper__content__subtitle ux-font-text-xxs">{{
            this.items.subtitle | translate
          }}</ion-text>
        </div>
      </div>
      <div class="ursc__wrapper__action">
        <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
      </div>
    </div>
  </ion-item> `,
  styleUrls: ['./tyc-items-cars.component.scss'],
})
export class TycItemsCarsComponent implements OnInit {
  @Input() items: any;
  constructor() {}

  ngOnInit() {}

  navigateTo(){}
}
