import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-global-progress-card',
  template: `
    <ion-accordion-group class="gpc__card">
      <ion-accordion class="gpc__card__accordion">
        <ion-item slot="header" class="gpc__card__accordion__item ion-no-padding" lines="none" color="info">
          <app-circle-progress
            *ngIf="this.allModules"
            [percentage]="this.percentage"
            [doneModules]="this.doneModules"
            [allModules]="this.allModules"
          ></app-circle-progress>
          <div>
            <div class="gpc__card__accordion__item__content">
              <ion-text class="ux-font-header-titulo">{{
                'financial_education.home.global_progress.card_title' | translate
              }}</ion-text>
              <ion-text *ngIf="this.percentage === 0" class="ux-font-text-xxs">
                {{ 'financial_education.home.global_progress.card_state_0' | translate }}
              </ion-text>
              <ion-text *ngIf="this.percentage >= 1 && this.percentage < 41" class="ux-font-text-xxs">
                {{
                  'financial_education.home.global_progress.card_state_25'
                    | translate: { doneModules: this.doneModules }
                }}
              </ion-text>
              <ion-text *ngIf="this.percentage >= 41 && this.percentage < 60" class="ux-font-text-xxs">
                {{
                  'financial_education.home.global_progress.card_state_50'
                    | translate: { doneModules: this.doneModules }
                }}
              </ion-text>
              <ion-text *ngIf="this.percentage >= 60 && this.percentage < 100" class="ux-font-text-xxs">
                {{
                  'financial_education.home.global_progress.card_state_75'
                    | translate: { doneModules: this.doneModules }
                }}
              </ion-text>
              <ion-text *ngIf="this.percentage === 100" class="ux-font-text-xxs">
                {{ 'financial_education.home.global_progress.card_state_100' | translate }}
              </ion-text>
            </div>
            <div class="gpc__card__accordion__item__content">
              <ion-text
                class="gpc__card__accordion__item__content__nft-text ux-font-text-xs"
                *ngIf="this.percentage === 0"
              >
                Generando NFT
              </ion-text>
              <ion-button
                color="white"
                fill="clear"
                class="gpc__card__accordion__item__content__nft-text ux-link-xs"
                *ngIf="this.percentage === 100"
                (click)="this.goToWallet()"
              >
                Ver mi NFT
              </ion-button>
            </div>
          </div>
        </ion-item>
        <div></div>
        <ion-list slot="content" lines="none" class="gpc__card__accordion__list">
          <ion-item class="ux-font-text-xxs gpc__card__accordion__list__item">
            <ul class="gpc__card__accordion__list__item__ulist">
              <li *ngFor="let module of this.modules">
                <ion-text class="ux-font-text-xs">{{ this.module.title | translate }}</ion-text>
                <ion-text class="ux-font-text-xxs">
                  ({{ 'financial_education.home.statuses.' + this.module.status | translate }})</ion-text
                >
              </li>
            </ul>
          </ion-item>
        </ion-list>
      </ion-accordion>
    </ion-accordion-group>
  `,
  styleUrls: ['./global-progress-card.component.scss'],
})
export class GlobalProgressCardComponent implements OnInit {
  @Input() modules: any;
  doneModules: number;
  allModules: number;
  percentage: number;

  constructor(private navController: NavController) {}

  ngOnInit() {
    this.calculateProgressPercentage();
  }

  calculateProgressPercentage() {
    this.allModules = this.modules.length;
    this.doneModules = this.modules.filter((mod) => mod.status === 'completed').length;
    this.percentage = (this.doneModules / this.allModules) * 100;
  }

  goToWallet(){
    this.navController.navigateForward('tabs/wallets')
  }
}
