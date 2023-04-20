import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-register-step-card',
  template: `<ion-item
    appTrackClick
    (click)="navigateTo()"
    lines="none"
    class="ion-no-padding ursc"
    [ngClass]="{ greenBorder: this.step.completed }"
    [disabled]="this.step.disabled"
    [dataToTrack]="{ eventLabel: this.step.name }"
  >
    <div class="ursc__wrapper">
      <div class="ursc__wrapper__step">
        <div [ngClass]="{ completeInfo: this.step.completed, incompleteInfo: !this.step.completed }">
          <ion-text class="ux-font-text-lg">{{ this.step.order }}</ion-text>
        </div>
      </div>
      <div class="ursc__wrapper__content">
        <ion-text class="ursc__wrapper__content__title ux-font-text-lg">{{ this.step.title | translate }}</ion-text>
        <div *ngIf="!this.step.completed" class="subtitle">
          <ion-text class="ursc__wrapper__content__subtitle ux-font-text-xxs">{{
            this.step.subtitle | translate
          }}</ion-text>
        </div>
      </div>
      <div *ngIf="!this.step.completed" class="ursc__wrapper__action">
        <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
      </div>
      <div *ngIf="this.step.completed" class="ursc__wrapper__action">
        <ion-text>{{ 'fiat_ramps.user_register.steps.complete' | translate }}</ion-text>
      </div>
    </div>
  </ion-item> `,
  styleUrls: ['./user-register-step-card.component.scss'],
})
export class UserRegisterStepCardComponent {
  @Input() step: any;
  @Input() status: string;
  @Output() cardClicked = new EventEmitter<any>();
  tplStep: any;

  constructor(private navController: NavController) {}

  navigateTo() {
    if (!this.step.completed && this.step.url) {  
      return this.navController.navigateForward(this.step.url);
    } else if (this.step.action) {
      this.action();
    }
  }

  action() {
    this.cardClicked.emit();
  }
}