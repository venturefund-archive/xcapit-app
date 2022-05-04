import { createNgModuleType } from '@angular/compiler/src/render3/r3_module_compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { ObjetiveDataService } from '../shared-financial-planner/services/objetive-data.service';

@Component({
  selector: 'app-objetive-info',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button class="oi__back" defaultHref="/financial-planner/new-objetive"></ion-back-button>
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
          <form [formGroup]="this.form">
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
            <div class="oi__input">
              <div class="oi__input__label">
                <ion-text class="ux-font-text-xs">
                  {{ 'financial_planner.objetive_info.label_1' | translate }}
                </ion-text>
              </div>
              <ion-input
                type="text"
                formControlName="name"
                class="input"
                [placeholder]="'financial_planner.objetive_info.placeholder_1' | translate"
              ></ion-input>
            </div>
            <div class="oi__category_label">
              <ion-label class="ux-font-input-label">{{
                'financial_planner.objetive_info.label_2' | translate
              }}</ion-label>
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
            <div class="oi__input">
              <div class="oi__input__label">
                <ion-text class="ux-font-text-xs">
                  {{ 'financial_planner.objetive_info.label_3' | translate }}
                </ion-text>
              </div>
              <ion-input
                type="number"
                formControlName="necessaryAmount"
                class="input"
                [placeholder]="'financial_planner.objetive_info.placeholder_2' | translate"
              ></ion-input>
            </div>
            <div class="oi__button">
              <ion-button
                class="ux_button"
                appTrackClick
                name="ux_financial_planner_see_strategies"
                type="submit"
                color="secondary"
                size="large"
                (click)="this.handleSubmit()"
                [disabled]="this.form.invalid"
              >
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
    necessaryAmount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    income: [''],
    expenses: [''],
  });
  income: number;
  expenses: number;
  saving: number;
  necessaryAmount: number;
  key = 'planner_data';

  items = [
    {
      icon: 'assets/img/financial-planner/categories/other.svg',
      title: 'financial_planner.objetive_info.categories.other',
      value: 'other',
    },
    {
      icon: 'assets/img/financial-planner/categories/travel.svg',
      title: 'financial_planner.objetive_info.categories.travel',
      value: 'travel',
    },
    {
      icon: 'assets/img/financial-planner/categories/purchases.svg',
      title: 'financial_planner.objetive_info.categories.purchases',
      value: 'purchases',
    },
    {
      icon: 'assets/img/financial-planner/categories/invest.svg',
      title: 'financial_planner.objetive_info.categories.invest',
      value: 'invest',
    },
    {
      icon: 'assets/img/financial-planner/categories/gift.svg',
      title: 'financial_planner.objetive_info.categories.gift',
      value: 'gift',
    },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private objetiveData: ObjetiveDataService,
    private appStorageService: AppStorageService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.setIncome();
    this.setExpenses();
    this.calculateSaving();
  }

  setIncome() {
    this.income = this.objetiveData.income;
    this.form.patchValue({ income: this.income });
  }

  setExpenses() {
    this.expenses = this.objetiveData.expenses;
    this.form.patchValue({ expenses: this.expenses });
  }

  calculateSaving() {
    this.saving = this.income - this.expenses;
  }

  handleSubmit() {
    if (this.form.valid) {
      if (this.saving >= this.form.value.necessaryAmount) {
        this.navController.navigateForward(['/financial-planner/success-objetive']);
        return;
      }
      this.appStorageService.set(this.key, this.form.value);
      this.navController.navigateForward('/financial-planner/result-objetive');
    }
  }
}
