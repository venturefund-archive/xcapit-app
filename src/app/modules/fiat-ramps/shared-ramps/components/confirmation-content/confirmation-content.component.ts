import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Photo } from 'src/app/shared/models/photo/photo.interface';

@Component({
  selector: 'app-confirmation-content',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/user-register"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.shared.confirmation_content.header' | translate }}
        </ion-title>
        <ion-label class="ux-font-text-xs cc__step_counter" slot="end"
          >{{ this.data.step_from }} {{ 'shared.step_counter.of' | translate }} 3</ion-label
        >
      </ion-toolbar>
      <ion-progress-bar class="cc__progress" [value]="0.25" color="info"></ion-progress-bar>
      <div class="cc__provider">
        <ion-text class="ux-font-text-xxs">{{
          'fiat_ramps.shared.confirmation_content.provider' | translate
        }}</ion-text>
      </div>
    </ion-header>
    <ion-content class="ion-padding cc__container">
      <div class="cc__container__title">
        <ion-text class="ux-font-text-xl">{{ this.data.title | translate }}</ion-text>
      </div>
      <div class="cc__container__subtitle">
        <ion-text class="ux-font-text-lg">{{ this.data.subtitle | translate }} </ion-text>
      </div>
      <div class="cc__container__description">
        <ion-text class="ux-font-text-base" [innerHTML]="this.data.items | translate"> </ion-text>
      </div>
      <div class="cc__container__image" *ngIf="this.image">
        <img [src]="this.image" />
      </div>
    </ion-content>
    <ion-footer class="cc__footer">
      <div class="cc__footer__confirmation">
        <ion-button
          class="ux_button cc__footer__confirmation__button"
          name="confirm_front_id"
          color="secondary"
          expand="block"
          (click)="this.emitConfirm()"
          >{{ 'fiat_ramps.shared.confirmation_content.button_primary' | translate }}</ion-button
        >
      </div>
      <div class="cc__footer__upload-button">
        <ion-button
          class="ux-button-outlined cc__footer__upload-button__button"
          name="back_button"
          expand="block"
          (click)="this.goBack()"
          >{{ 'fiat_ramps.shared.confirmation_content.button_secondary' | translate }}</ion-button
        >
      </div>
    </ion-footer>`,
  styleUrls: ['./confirmation-content.component.scss'],
})
export class ConfirmationContentComponent implements OnInit {
  @Input() data;
  @Input() image: string;
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() back: EventEmitter<void> = new EventEmitter<void>();
  constructor() {}

  ngOnInit() {}

  emitConfirm() {
    this.confirm.emit();
  }

  goBack() {
    this.back.emit();
  }
}
