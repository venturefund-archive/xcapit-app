import { Component, OnInit } from '@angular/core';
import { MODULES_CRYPTO } from '../../constants/crypto';
import { MODULES_FINANCE } from '../../constants/finance';

@Component({
  selector: 'app-global-progress-card',
  template: `
    <ion-accordion-group class="gpc__card">
      <ion-accordion class="gpc__card__accordion">
        <ion-item slot="header" class="gpc__card__accordion__item ion-no-padding" lines="none" color="info">
          <app-circle-progress
            [percentage]="this.percentage"
            [doneModules]="this.doneModules"
            [allModules]="this.allModules"
          ></app-circle-progress>
          <div class="gpc__card__accordion__item__content">
            <ion-text class="ux-font-header-titulo">{{
              'financial_education.home.global_progress.card_title' | translate
            }}</ion-text>
            <ion-text *ngIf="this.percentage === 0" class="ux-font-text-xxs">
              {{ 'financial_education.home.global_progress.card_state_0' | translate }}
            </ion-text>
            <ion-text *ngIf="this.percentage >= 1 && this.percentage < 41" class="ux-font-text-xxs">
              {{
                'financial_education.home.global_progress.card_state_25' | translate: { doneModules: this.doneModules }
              }}
            </ion-text>
            <ion-text *ngIf="this.percentage >= 41 && this.percentage < 60" class="ux-font-text-xxs">
              {{
                'financial_education.home.global_progress.card_state_50' | translate: { doneModules: this.doneModules }
              }}
            </ion-text>
            <ion-text *ngIf="this.percentage >= 60 && this.percentage < 100" class="ux-font-text-xxs">
              {{
                'financial_education.home.global_progress.card_state_75' | translate: { doneModules: this.doneModules }
              }}
            </ion-text>
            <ion-text *ngIf="this.percentage === 100" class="ux-font-text-xxs">
              {{ 'financial_education.home.global_progress.card_state_100' | translate }}
            </ion-text>
          </div>
        </ion-item>
        <ion-list slot="content" lines="none" class="gpc__card__accordion__list">
          <ion-item class="ux-font-text-xxs gpc__card__accordion__list__item">
            <ul class="gpc__card__accordion__list__item__ulist">
              <li *ngFor="let module of this.modules">
                <ion-text class="ux-font-text-xs">{{ module.progress_title | translate }}</ion-text>
                <ion-text *ngIf="module.done" class="ux-font-text-xxs"> ({{ 'financial_education.home.statuses.complete'| translate }})</ion-text>
                <ion-text *ngIf="!module.done" class="ux-font-text-xxs"> ({{ 'financial_education.home.statuses.to_do' | translate }})</ion-text>
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
  doneModules: number;
  allModules: number;
  percentage: number;
  modules;
  constructor() {}

  ngOnInit() {
    this.setModules();
    this.calculateProgressPercentage();
   
  }

  setModules() {
    this.modules = [...MODULES_FINANCE, ...MODULES_CRYPTO].filter((mod) => !mod.disabled);

  }

  calculateProgressPercentage() {
    this.allModules = this.modules.length;
    this.doneModules = this.modules.filter((mod) => mod.done).length;
    this.percentage = (this.doneModules / this.allModules) * 100;
  }
}
