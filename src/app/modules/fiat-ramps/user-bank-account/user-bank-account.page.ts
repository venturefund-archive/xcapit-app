import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { UserBankDataService } from '../shared-ramps/services/user-bank-data/user-bank-data.service';

@Component({
  selector: 'app-bank-account',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/select-provider"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.cash_out.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form *ngIf="this.cleanedCommonFields && this.cleanedSpecificFields" class="cok__form" [formGroup]="this.form">
        <ion-text class="ux-font-text-lg">{{ 'fiat_ramps.cash_out.title' | translate }}</ion-text>
        <div *ngFor="let field of this.cleanedCommonFields">
          <ng-container *ngIf="field.type === 'Input'">
            <app-ux-input [controlName]="field.name_of_param" [label]="field.label"> </app-ux-input>
          </ng-container>
          <ng-container *ngIf="field.type === 'Select'">
            <app-input-select
              [controlName]="field.name_of_param"
              [label]="field.label"
              [modalTitle]="field.label"
              [data]="field.options"
              key="key"
              valueKey="value"
              [selectorStyle]="'new-style'"
            >
            </app-input-select>
          </ng-container>
        </div>
        <div *ngFor="let field of this.cleanedSpecificFields">
          <ng-container *ngIf="field.type === 'Input'">
            <app-ux-input [controlName]="field.name_of_param" [label]="field.label"> </app-ux-input>
          </ng-container>
          <ng-container *ngIf="field.type === 'Select'">
            <app-input-select
              [controlName]="field.name_of_param"
              [label]="field.label"
              [modalTitle]="field.label"
              [data]="field.options"
              key="key"
              [selectorStyle]="'new-style'"
            >
            </app-input-select>
          </ng-container>
        </div>
        <app-backup-information-card
          [text]="'fiat_ramps.cash_out.disclaimer'"
          [textClass]="'ux-home-backup-card'"
          [backgroundClass]="'ux-white-background-card'"
        >
        </app-backup-information-card>
      </form>
    </ion-content>

    <ion-footer class="sw__footer">
      <div class="sw__footer__submit-button ion-padding">
        <ion-button
          class="ux_button sw__footer__submit-button__button"
          appTrackClick
          name="ux_sell_bankdata_continue"
          color="secondary"
          expand="block"
          [disabled]="!this.form.valid"
          (click)="this.submitForm()"
          >{{ 'wallets.send.send_detail.continue_button' | translate }}</ion-button
        >
      </div>
    </ion-footer> `,
  styleUrls: ['./user-bank-account.page.scss'],
})
export class UserBankAccountPage {
  commonFields: any;
  specificFields: any;
  cleanedCommonFields: any;
  cleanedSpecificFields: any;
  tokenOperationFields: any;
  form = new FormGroup({});
  constructor(
    private fiatRampsService: FiatRampsService,
    private tokenOperationData: TokenOperationDataService,
    private navController: NavController,
    private userBankDataService: UserBankDataService
  ) {}

  async ionViewWillEnter() {
    await this.setFields();
    this.cleanFields();
    this.buildForm();
    this.addFormFieldFromTokenOperation();
  }

  async setFields() {
    this.commonFields = await this.fiatRampsService.getCashOutFormFields().toPromise();
    this.specificFields = await this.fiatRampsService
      .getCashOutFormFields(this.tokenOperationData.tokenOperationData.country)
      .toPromise();
  }

  cleanFields() {
    this.cleanedCommonFields = this.commonFields.data.filter(
      (cf) => cf.name_of_param != 'country' && cf.name_of_param != 'currency'
    );
    this.cleanedSpecificFields = this.specificFields.data;
  }

  buildForm() {
    this._addFieldsToForm(this.cleanedCommonFields);
    this._addFieldsToForm(this.cleanedSpecificFields);
  }

  addFormFieldFromTokenOperation() {
    const fields = [
      {
        value: this.tokenOperationData.tokenOperationData.asset,
        name_of_param: 'currency',
        required: true,
      },
      {
        value: this.tokenOperationData.tokenOperationData.country,
        name_of_param: 'country',
        required: true,
      },
    ];
    this._addFieldsToForm(fields);
  }

  private _addFieldsToForm(fields) {
    for (const field of fields) {
      this._createAndAddFieldToForm(field);
    }
  }

  private _createAndAddFieldToForm(field) {
    const formControl = new FormControl(field.value ? field.value : '', field.required ? Validators.required : null);
    this.form.addControl(field.name_of_param, formControl);
  }

  sanitizeForm() {
    for (const key in this.form.value) {
      if (typeof this.form.value[key] === 'object') {
        this.form.value[key] = this.form.value[key].value;
      }
    }
  }

  submitForm() {
    this.sanitizeForm();
    this.userBankDataService.set(this.form.value);
    this.continue();
  }

  continue() {
    this.navController.navigateForward(['fiat-ramps/sell-order']);
  }
}
