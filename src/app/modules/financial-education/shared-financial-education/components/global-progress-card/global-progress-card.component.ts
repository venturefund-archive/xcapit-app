import { Component, Input, OnInit } from '@angular/core';
import { MODULES_CRYPTO } from '../../constants/crypto';
import { MODULES_FINANCE } from '../../constants/finance';

@Component({
  selector: 'app-global-progress-card',
  template: `
    <ion-accordion-group class="gpc__card">
      <ion-accordion class="gpc__card__accordion">
        <ion-item slot="header" class="gpc__card__accordion__item ion-no-padding" lines="none" color="info">
          <app-circle-progress
            (percentage)="this.setPercentage($event)"
            [doneModules]="this.doneModules"
            [allModules]="this.allModules"
          ></app-circle-progress>
          <div class="gpc__card__accordion__item__content">
            <ion-text class="ux-font-header-titulo">{{
              'financial_education.home.global_progress.card_title' | translate
            }}</ion-text>
            <ion-text *ngIf="this.percentage >= 0 && this.percentage < 50" class="ux-font-text-xxs">
              {{ 'financial_education.home.global_progress.card_state_0' | translate }}
            </ion-text>
            <ion-text *ngIf="this.percentage >= 50 && this.percentage < 60" class="ux-font-text-xxs">
              {{ 'financial_education.home.global_progress.card_state_50' | translate: { doneModules: this.doneModules } }} 
            </ion-text>
            <ion-text *ngIf="this.percentage >= 60" class="ux-font-text-xxs">
            {{ 'financial_education.home.global_progress.card_state_100' | translate }}
            
            </ion-text>
          </div>
        </ion-item>
        <ion-list slot="content" lines="none" class="gpc__card__accordion__list">
          <ion-item class="ux-font-text-xxs gpc__card__accordion__list__item">
            <ul class="gpc__card__accordion__list__item__ulist">
              <li *ngFor="let module of this.modules">
                <ion-text class="ux-font-text-xs">{{ module.progress_title | translate }}</ion-text>
                <ion-text class="ux-font-text-xxs">{{ module.done ? ' (completo)' : ' (por hacer)' }}</ion-text>
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
  modules = [...MODULES_FINANCE, ...MODULES_CRYPTO];
  constructor() {}

  ngOnInit() {
    this.modules = this.modules.filter((mod) => !mod.disabled);
    this.allModules = this.modules.length;
    this.doneModules = this.modules.filter((mod) => mod.done).length;
    console.log(this.percentage);
  }

  setPercentage(value) {
    this.percentage = value;
  }
}
