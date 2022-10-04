import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-register-step-card',
  template: `<ion-item (click)="navigateTo()" lines="none" class="ion-no-padding ursc" [disabled]="this.disabled">
    <div class="ursc__wrapper">
      <div class="ursc__wrapper__step">
        <div class="ursc__wrapper__step__circle">
          <ion-text class="ux-font-text-lg">{{ this.number }}</ion-text>
        </div>
      </div>
      <div class="ursc__wrapper__content">
        <ion-text class="ursc__wrapper__content__title ux-font-text-lg">{{ this.title | translate }}</ion-text>
        <ion-text class="ursc__wrapper__content__subtitle ux-font-text-xxs">{{ this.subtitle | translate }}</ion-text>
      </div>
      <div class="ursc__wrapper__action">
        <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
      </div>
    </div>
  </ion-item> `,
  styleUrls: ['./user-register-step-card.component.scss'],
})
export class UserRegisterStepCardComponent implements OnInit {
  @Input() number: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() url: string;
  @Input() disabled: boolean;
  constructor(private navController: NavController) {}

  ngOnInit() {}

  navigateTo() {
    return this.navController.navigateForward(this.url);
  }
}
