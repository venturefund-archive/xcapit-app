import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-initiation-wallet-step-card',
  template: `
    <ion-item
      appTrackClick
      (click)="navigateTo()"
      lines="none"
      name="navigate"
      class="ion-no-padding iwsc"
      [dataToTrack]="{ eventLabel: this.eventLabel }"
    >
      <div class="iwsc__wrapper">
        <div class="iwsc__wrapper__step">
          <div *ngIf="this.nextStep">
            <ion-icon [name]="this.nextStep.icon"></ion-icon>
          </div>
          <div *ngIf="this.stepCompleted">
            <ion-icon [name]="this.stepCompleted.icon"></ion-icon>
          </div>
        </div>
        <div *ngIf="this.nextStep" class="iwsc__wrapper__content">
          <ion-text class="iwsc__wrapper__content__title ux-font-text-lg">{{
            this.nextStep.title | translate
          }}</ion-text>
          <div class="subtitle">
            <ion-text class="iwsc__wrapper__content__subtitle ux-font-text-xxs">{{
              this.nextStep.subtitle | translate
            }}</ion-text>
          </div>
        </div>
        <div *ngIf="this.stepCompleted" class="iwsc__wrapper__content">
          <ion-text class="iwsc__wrapper__content__title ux-font-text-lg">{{
            this.stepCompleted.title | translate
          }}</ion-text>
        </div>

        <div *ngIf="this.nextStep" class="iwsc__wrapper__action">
          <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
        </div>
        <div *ngIf="this.stepCompleted" class="iwsc__wrapper__action">
          <ion-text>{{ 'wallets.experimental_onboarding.completed' | translate }}</ion-text>
        </div>
      </div>
    </ion-item>
  `,
  styleUrls: ['./initiation-wallet-step-card.component.scss'],
})
export class InitiationWalletStepCardComponent implements OnInit {
  @Input() nextStep: any;
  @Input() stepCompleted: any;
  @Output() navigate = new EventEmitter<void>();
  eventLabel: string;
  constructor() {}

  ngOnInit() {
    this.setEventLabel();
  }

  setEventLabel() {
    this.eventLabel = this.nextStep ? this.nextStep.name : '';
  }

  navigateTo(): void {
    this.navigate.emit(this.nextStep);
  }
}
