import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';

@Component({
  selector: 'app-objetive-info',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button class="oi__back" defaultHref=""></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-start">{{ 'financial_planner.objetive_info.header' | translate }}</ion-title>
        <ion-label class="ux-font-text-xs oi__step_counter" slot="end"
          >2 {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content">
          <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
            <div class="oi__title">
              <ion-text class="ux-font-text-xl">{{ 'financial_planner.objetive_info.title' | translate }}</ion-text>
            </div>
            <div class="oi__subtitle">
              <ion-text class="ux-font-header-titulo">{{
                'financial_planner.objetive_info.subtitle_1' | translate
              }}</ion-text>
            </div>
            <div class="oi__paragraph">
              <ion-text class="ux-font-text-base">{{
                'financial_planner.objetive_info.paragraph_1' | translate
              }}</ion-text>
            </div>
            <app-ux-input
              controlName="name"
              type="text"
              [label]="'financial_planner.objetive_info.label_1' | translate"
              inputmode="text"
              [placeholder]="'financial_planner.objetive_info.placeholder_1' | translate"
            ></app-ux-input>
            <div class="oi__category_label">
              <ion-label class="ux-font-input-label">{{ 'financial_planner.objetive_info.label_2'| translate}}</ion-label>
            </div>
            <div class="oi__category">
                <app-filter-tab [items]="this.items" controlName="category"></app-filter-tab>
            </div>
            <div class="oi__subtitle">
              <ion-text class="ux-font-header-titulo">{{
                'financial_planner.objetive_info.subtitle_2' | translate
              }}</ion-text>
            </div>
            <div class="oi__paragraph">
              <ion-text class="ux-font-text-base">{{
                'financial_planner.objetive_info.paragraph_2' | translate
              }}</ion-text>
            </div>
            <app-ux-input
              controlName="necessaryAmount"
              type="number"
              [label]="'financial_planner.objetive_info.label_3' | translate"
              inputmode="number"
              [placeholder]="'financial_planner.objetive_info.placeholder_2' | translate"
            ></app-ux-input>
            <div class="oi__button">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Next"
                type="submit"
                color="secondary"
                size="large"
                [disabled]="this.form.invalid">
                {{ 'financial_planner.objetive_info.button' | translate }}
              </ion-button>
            </div>
          </form>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./objetive-info.page.scss'],
})
export class ObjetiveInfoPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    category: ['other', Validators.required],
    necessaryAmount: ['', Validators.required],
  });

  items = [
    { 
      icon:'assets/img/financial-planner/categories/other.svg',
      title: 'financial_planner.objetive_info.categories.category_1',
      value: 'other',
    },
    {
      icon:'assets/img/financial-planner/categories/travel.svg',
      title: 'financial_planner.objetive_info.categories.category_2',
      value: 'travel',
    },
    {
      icon:'assets/img/financial-planner/categories/purchase.svg',
      title: 'financial_planner.objetive_info.categories.category_3',
      value: 'purchases',
    },
    {
      icon:'assets/img/financial-planner/categories/invest.svg',
      title: 'financial_planner.objetive_info.categories.category_4',
      value: 'invest',
    },
    {
      icon:'assets/img/financial-planner/categories/gift.svg',
      title: 'financial_planner.objetive_info.categories.category_5',
      value: 'gift',
    },
  ];
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {}

  handleSubmit(){
    console.log(this.form.value)
  }
}
