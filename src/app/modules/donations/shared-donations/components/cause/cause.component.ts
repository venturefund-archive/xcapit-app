import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cause',
  template: `
    <div class="content" (click)="this.goToCause()">
      <div class="cc ">
        <div class="cc__image">
          <img [src]="this.cause.image" alt="Cause Image" />
        </div>
        <div class="cc__logo">
          <img [src]="this.cause.logo" alt="Cause logo" />
        </div>
        <div class="cc__text-badge">
          <div class="cc__text-badge__text">
            <ion-text class="ux-font-header-titulo text">{{ this.cause.title | translate }}</ion-text>
          </div>
          <ion-badge class="ux-font-num-subtitulo ux-badge cc__text-badge__badge" slot="end">{{
            this.badge | translate
          }}</ion-badge>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./cause.component.scss'],
})
export class CauseComponent implements OnInit {
  @Input() cause;
  badge: string;
  constructor(private navController: NavController) {}

  ngOnInit() {
    this.setType();
  }

  setType() {
    this.badge = `donations.causes.types.${this.cause.type}`;
  }

  goToCause(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        cause: this.cause.id
      },
    };
    this.navController.navigateForward(['donations/description-cause'], navigationExtras)


  }

}
