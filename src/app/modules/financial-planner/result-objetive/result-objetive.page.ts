import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { environment } from 'variables.env';
import { ToastWithButtonsComponent } from '../../../shared/components/toast-with-buttons/toast-with-buttons.component';

@Component({
  selector: 'app-result-objetive',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded no-border">
        <ion-buttons slot="start">
          <ion-back-button class="ro__back" defaultHref="/financial-planner/objetive-info"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'financial_planner.objetive_info.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div *ngIf="this.data" class="objetive-card">
        <app-objetive-card
          [icon]="this.icon"
          [category]="this.category"
          [necessaryAmount]="this.necessaryAmount"
          [name]="this.name"
        ></app-objetive-card>
      </div>
      <div class="ro">
        <div class="ro__title">
          <ion-text class="ux-font-text-lg">{{ 'financial_planner.result_objetive.saving' | translate }}</ion-text>
        </div>
        <div class="ro__description">
          <ion-text class="ux-font-text-base">{{ this.savingText }}</ion-text>
        </div>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border">
      <ion-toolbar class="ro__footer">
        <div class="ro__footer__actions">
          <ion-button
            appTrackClick
            name="ux_financial_planner_back_to_start"
            class="ux_button ion-no-padding"
            size="small"
            fill="clear"
            color="info"
            (click)="this.goToHome()"
          >
            {{ 'financial_planner.result_objetive.back_button' | translate }}
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>
  `,
  styleUrls: ['./result-objetive.page.scss'],
})
export class ResultObjetivePage {
  data: any;
  savingText: string;
  weeks: number;
  saving: number;
  icon: string;
  category: string;
  name: string;
  necessaryAmount: number;
  env = environment.environment;
  isOpen = false;

  constructor(
    private appStorage: AppStorageService,
    private translate: TranslateService,
    private navController: NavController,
    private modalController: ModalController
  ) {}

  async ionViewDidEnter() {
    await this.getPlannerData();
    this.calculationsSaving();
  }

  async getPlannerData() {
    this.data = await this.appStorage.get('planner_data');
    this.setData();
  }

  setData() {
    this.name = this.data.name;
    this.necessaryAmount = this.data.necessaryAmount;
    this.icon = `assets/img/financial-planner/categories/${this.data.category}.svg`;
    this.category = `financial_planner.shared_financial_planner.objetive_card.categories.${this.data.category}`;
  }

  calculationsSaving() {
    this.saving = this.data.income - this.data.expenses;
    this.weeks = Math.round(this.data.necessaryAmount / (this.saving / 4));
    this.savingText = this.translate.instant('financial_planner.result_objetive.saving_description', {
      saving: this.saving,
      weeks: this.weeks,
    });
  }

  goToHome() {
    this.navController.navigateForward(['/tabs/home']);
  }

  async openModalMoreThan500Weeks() {
    const modal = await this.modalController.create({
      component: ToastWithButtonsComponent,
      cssClass: 'ux-toast-warning',
      showBackdrop: false,
      componentProps: {
        text: this.translate.instant('financial_planner.result_objetive.informative_modal'),
        primaryButtonText: this.translate.instant('financial_planner.result_objetive.informative_modal_button'),
        primaryButtonRoute: '/financial-planner/new-objetive',
      },
    });
    modal.present();
    this.isOpen = false;
  }
}
