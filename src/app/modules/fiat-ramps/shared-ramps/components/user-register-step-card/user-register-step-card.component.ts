import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-register-step-card',
  template: `<ion-item
    appTrackClick
    (click)="navigateTo()"
    lines="none"
    class="ion-no-padding ursc"
    [ngClass]="{ greenBorder: this.completed }"
    [disabled]="this.disabled"
    [dataToTrack]="{ eventLabel: this.name }"
  >
    <div class="ursc__wrapper">
      <div class="ursc__wrapper__step">
        <div [ngClass]="{ completeInfo: this.completed, incompleteInfo: !this.completed }">
          <ion-text class="ux-font-text-lg">{{ this.order }}</ion-text>
        </div>
      </div>
      <div class="ursc__wrapper__content">
        <ion-text class="ursc__wrapper__content__title ux-font-text-lg">{{ this.title | translate }}</ion-text>
        <div *ngIf="!this.completed" class="subtitle">
          <ion-text class="ursc__wrapper__content__subtitle ux-font-text-xxs">{{ this.subtitle | translate }}</ion-text>
        </div>
      </div>
      <div *ngIf="!this.completed" class="ursc__wrapper__action">
        <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
      </div>
      <div *ngIf="this.completed" class="ursc__wrapper__action">
        <ion-text>{{ 'fiat_ramps.user_register.steps.complete' | translate }}</ion-text>
      </div>
    </div>
  </ion-item> `,
  styleUrls: ['./user-register-step-card.component.scss'],
})
export class UserRegisterStepCardComponent implements OnChanges {
  @Input() order: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() url: string;
  @Input() disabled: boolean;
  @Input() name: string;
  @Input() status: string;
  completed = false;
  constructor(private navController: NavController) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.setCurrentStatus();
  }

  setCurrentStatus() {
    if (this.status === 'USER_INFORMATION' && this.order === '2') this.disabled = true;
    if (this.status === 'USER_IMAGES' && this.order === '1') this.completed = true;
    if (this.status === 'COMPLETE') this.completed = true;
  }

  navigateTo() {
    return this.navController.navigateForward(this.url);
  }
}
