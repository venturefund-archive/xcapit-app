import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { ObjetiveDataService } from '../shared-financial-planner/services/objetive-data.service';

@Component({
  selector: 'app-new-objetive',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/financial-planner/information"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-start">{{ 'financial_planner.planner_information.header' | translate }}</ion-title>
        <ion-label color="white" class="ux-font-text-xs step_counter" slot="end"
          >1 {{ 'financial_planner.new_objetive.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="this.form">
        <div class="content">
          <div class="content__title">
            <ion-text class="ux-font-text-xl"> {{ 'financial_planner.new_objetive.title' | translate }} </ion-text>
          </div>
          <div class="content__income">
            <div class="content__subtitle">
              <ion-text class="ux-font-header-titulo">
                {{ 'financial_planner.new_objetive.subtitle_income' | translate }}
              </ion-text>
            </div>
            <div class="content__description">
              <ion-text class="ux-font-text-base">
                {{ 'financial_planner.new_objetive.description_income' | translate }}
              </ion-text>
            </div>
            <div class="content__input">
              <div class="content__input__label">
                <ion-text class="ux-font-text-xs">
                  {{ 'financial_planner.new_objetive.label' | translate }}
                </ion-text>
              </div>
              <ion-input
                type="number"
                formControlName="income"
                class="input"
                [placeholder]="'financial_planner.new_objetive.placeholder' | translate"
              ></ion-input>
            </div>
          </div>
          <div class="content__expenses">
            <div class="content__subtitle">
              <ion-text class="ux-font-header-titulo">
                {{ 'financial_planner.new_objetive.subtitle_expenses' | translate }}
              </ion-text>
            </div>
            <div class="content__description">
              <ion-text class="ux-font-text-base">
                {{ 'financial_planner.new_objetive.description_expenses' | translate }}
              </ion-text>
            </div>
            <div class="content__input">
              <div class="content__input__label">
                <ion-text class="ux-font-text-xs"> {{ 'financial_planner.new_objetive.label' | translate }} </ion-text>
              </div>
              <ion-input
                type="number"
                formControlName="expenses"
                class="input"
                [placeholder]="'financial_planner.new_objetive.placeholder' | translate"
              ></ion-input>
            </div>
          </div>
          <div class="content__disclaimer">
            <ion-text class="ux-font-text-xxs">
              {{ 'financial_planner.new_objetive.disclaimer' | translate }}
            </ion-text>
          </div>
          <div class="content__button">
            <ion-button
              appTrackClick
              name="ux_financial_planner_continue"
              class="ux_button"
              color="secondary"
              expand="block"
              [disabled]="!this.form.valid"
              (click)="this.goToObjetiveInfo()"
            >
              {{ 'financial_planner.new_objetive.button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./new-objetive.page.scss'],
})
export class NewObjetivePage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    income: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    expenses: ['', [Validators.required, CustomValidators.greaterThan(0)]],
  });
  constructor(
    private formBuilder: FormBuilder,
    private objetiveData: ObjetiveDataService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.showData();
  }

  goToObjetiveInfo() {
    if (this.form.valid) {
      this.saveObjetiveData();
      this.navController.navigateForward('/financial-planner/objetive-info');
    }
  }

  saveObjetiveData() {
    this.objetiveData.income = this.form.value.income;
    this.objetiveData.expenses = this.form.value.expenses;
  }

  showData() {
    this.form.patchValue({ income: this.objetiveData.income, expenses: this.objetiveData.expenses });
  }
}
