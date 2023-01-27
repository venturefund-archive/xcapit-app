import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { ObjetiveDataService } from '../shared-financial-planner/services/objetive-data.service';

@Component({
  selector: 'app-objetive-info',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__left ux_toolbar__rounded no-border">
        <ion-buttons slot="start">
          <ion-back-button class="oi__back" defaultHref="/financial-planner/new-objetive"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-start">{{ 'financial_planner.objetive_info.header' | translate }}</ion-title>
        <ion-label class="ux-font-text-xs ux_toolbar__step" slot="end"
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
                maxLength="20"
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
  form: UntypedFormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    category: ['other', Validators.required],
    necessaryAmount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    income: [''],
    expenses: [''],
  });
  saving: number;
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
    private appStorage: AppStorageService,
    private formBuilder: UntypedFormBuilder,
    private objetiveData: ObjetiveDataService,
    private appStorageService: AppStorageService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.setData();
    this.calculateSaving();
  }

  async setData() {
    const objetiveInfoData = await this.objetiveStorageData();

    this.form.patchValue({
      income: this.objetiveData.income,
      expenses: this.objetiveData.expenses,
      ...objetiveInfoData,
    });
  }

  async objetiveStorageData() {
    const plannerData = await this.appStorage.get('planner_data');
    if (plannerData) {
      delete plannerData['income'];
      delete plannerData['expenses'];
    }
    return plannerData;
  }

  calculateSaving() {
    this.saving = this.form.value.income - this.form.value.expenses;
  }

  handleSubmit() {
    if (this.form.valid) {
      let url = [];
      if (this.goalAlreadyAchieved()) {
        this.appStorageService.set(this.key, this.form.value);
        url = ['/financial-planner/success-objetive'];
      } else {
        this.appStorageService.set(this.key, this.form.value);
        url = ['/financial-planner/result-objetive'];
      }
      this.navController.navigateForward(url);
    }
  }

  goalAlreadyAchieved(): boolean {
    return this.saving >= this.form.value.necessaryAmount;
  }
}
