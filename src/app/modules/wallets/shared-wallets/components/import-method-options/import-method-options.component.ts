import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMPORT_ITEM_METHOD } from '../../constants/import-item-method';

@Component({
  selector: 'app-import-method-options',
  template: `<ion-item
    appTrackClick
    (click)="navigateTo()"
    lines="none"
    class="ion-no-padding imp"
    [dataToTrack]="{ eventLabel: this.method.name }"
  >
    <div class="imp__wrapper">
      <img [src]="this.method.img" />
      <div class="imp__wrapper__content">
        <ion-text class="imp__wrapper__content__title ux-font-text-lg">{{ this.method.title | translate }}</ion-text>
        <div class="subtitle">
          <ion-text class="imp__wrapper__content__subtitle ux-font-text-xxs">{{
            this.method.subtitle | translate
          }}</ion-text>
        </div>
      </div>
      <div class="imp__wrapper__action">
        <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
      </div>
    </div>
  </ion-item> `,
  styleUrls: ['./import-method-options.component.scss'],
})
export class ImportMethodOptionsComponent implements OnInit {
  @Input() method: any;
  @Output() route = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}

  navigateTo() {
    this.route.emit(this.method.route);
  }
}
