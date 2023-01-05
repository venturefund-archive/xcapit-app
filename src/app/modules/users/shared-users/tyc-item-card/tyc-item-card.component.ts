import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tyc-item-card',
  template: `<ion-item appTrackClick (click)="navigateTo()" lines="none" class="ion-no-padding tcic">
    <div class="tcic__wrapper">
      <div class="tcic__wrapper__img">
        <img [src]="this.item.img" />
      </div>
      <div class="tcic__wrapper__content">
        <ion-text class="tcic__wrapper__content__title ux-font-text-lg">{{ this.item.title | translate }}</ion-text>

        <ion-text class="tcic__wrapper__content__subtitle ux-font-text-xxs">{{
          this.item.subtitle | translate
        }}</ion-text>
      </div>
      <div class="tcic__wrapper__action">
        <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
      </div>
    </div>
  </ion-item> `,
  styleUrls: ['./tyc-item-card.component.scss'],
})
export class TycItemCardComponent implements OnInit {
  @Input() item: any;
  @Output() navigate = new EventEmitter<void>();
  constructor() {}

  ngOnInit() {}

  navigateTo() {
    this.navigate.emit(this.item);
  }
}
