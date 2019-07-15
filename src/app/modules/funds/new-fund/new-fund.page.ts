import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
// tslint:disable-next-line: max-line-length
import { BinanceApikeyTutorialModalComponent } from '../../tutorials/shared-tutorials/components/binance-apikey-tutorial-modal/binance-apikey-tutorial-modal.component';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';
import { TranslateService } from '@ngx-translate/core';
import { Currency } from '../shared-funds/enums/currency.enum';
import { ActivatedRoute } from '@angular/router';
import { FundFormActions } from '../shared-funds/enums/fund-form-actions.enum';

@Component({
  selector: 'app-new-fund',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ this.action | fundActionFormTitle | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form [formGroup]="this.form" (ngSubmit)="this.save()">
        <ion-item-group
          class="ion-padding-top"
          *ngIf="this.action === this.fundFormActions.NewFund"
        >
          <ion-item-divider>
            <ion-label>{{
              'funds.new_fund.ion_divider1' | translate
            }}</ion-label>
          </ion-item-divider>

          <div class="ion-padding-start ion-padding-end">
            <ion-item>
              <ion-label position="floating">{{
                'funds.new_fund.api_key' | translate
              }}</ion-label>
              <ion-input formControlName="api_key" type="text"></ion-input>
            </ion-item>
            <app-errors-form-item controlName="api_key"></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">{{
                'funds.new_fund.secret_key' | translate
              }}</ion-label>
              <ion-input formControlName="secret_key" type="text"></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="secret_key"
            ></app-errors-form-item>
          </div>
          <div
            class="new-fund__apikey-help ion-text-center ion-padding-end ion-padding-start ion-padding-top"
          >
            <p>
              <ion-icon name="information-circle-outline"></ion-icon>
              {{ 'funds.new_fund.p1' | translate }}
              <a class="local-a" (click)="this.openBinanceAPIKeys()">{{
                'funds.new_fund.a1' | translate
              }}</a>
            </p>
          </div>
        </ion-item-group>

        <ion-item-group class="ion-padding-top">
          <ion-item-divider>
            <ion-label>{{
              'funds.new_fund.ion_divider2' | translate
            }}</ion-label>
          </ion-item-divider>

          <div class="ion-padding-start ion-padding-end">
            <ion-item>
              <ion-label position="floating">{{
                'funds.new_fund.fund_name' | translate
              }}</ion-label>
              <ion-input
                formControlName="fund_name"
                type="text"
                [readonly]="this.action !== this.fundFormActions.NewFund"
              ></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="fund_name"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">{{
                'funds.new_fund.currency' | translate
              }}</ion-label>
              <ion-select
                formControlName="currency"
              >
                <ion-select-option [value]="this.currencyEnum.BTC">
                  {{ this.currencyEnum.BTC }}
                </ion-select-option>
                <ion-select-option [value]="this.currencyEnum.USDT">
                  {{ this.currencyEnum.USD }}
                </ion-select-option>
              </ion-select>
            </ion-item>
            <app-errors-form-item controlName="currency"></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">{{
                'funds.new_fund.cantidad_dias' | translate
              }}</ion-label>
              <ion-select
                formControlName="cantidad_dias"
              >
                <ion-select-option [value]="30"
                  >30
                  {{
                    'funds.new_fund.ion_option_cantidad_dias' | translate
                  }}</ion-select-option
                >
                <ion-select-option [value]="60"
                  >60
                  {{
                    'funds.new_fund.ion_option_cantidad_dias' | translate
                  }}</ion-select-option
                >
                <ion-select-option [value]="90"
                  >90
                  {{
                    'funds.new_fund.ion_option_cantidad_dias' | translate
                  }}</ion-select-option
                >
              </ion-select>
            </ion-item>
            <app-errors-form-item
              controlName="cantidad_dias"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">{{
                'funds.new_fund.take_profit' | translate
              }}</ion-label>
              <ion-input
                formControlName="take_profit"
                type="text"
                inputmode="numeric"
              ></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="take_profit"
              [errors]="this.onlyIntegersErrors"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">{{
                'funds.new_fund.stop_loss' | translate
              }}</ion-label>
              <ion-input
                formControlName="stop_loss"
                type="text"
                inputmode="numeric"
              ></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="stop_loss"
              [errors]="this.onlyIntegersErrors"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">{{
                'funds.new_fund.risk_level' | translate
              }}</ion-label>
              <ion-select formControlName="risk_level">
                <ion-select-option>{{
                  'funds.new_fund.ion_option_risk_level_pro' | translate
                }}</ion-select-option>
                <ion-select-option>{{
                  'funds.new_fund.ion_option_risk_level_classic' | translate
                }}</ion-select-option>
              </ion-select>
            </ion-item>
            <app-errors-form-item
              controlName="risk_level"
            ></app-errors-form-item>
          </div>
        </ion-item-group>
        <div class="ion-padding ion-margin-top">
          <ion-button
            expand="block"
            size="large"
            type="submit"
            color="success"
            [disabled]="
              !this.form.valid || (this.submitButtonService.isDisabled | async)
            "
          >
            <ion-icon slot="start" name="checkmark-circle-outline"></ion-icon>
            {{ this.action | fundActionFormTextButton | translate }}
          </ion-button>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./new-fund.page.scss']
})
export class NewFundPage implements OnInit {
  fundFormActions = FundFormActions;
  onlyIntegersErrors: ItemFormError[] = CONFIG.fieldErrors.onlyIntegers;

  currencyEnum = Currency;
  fundName: string;
  action: string;
  fundForUpdate: any;

  form: FormGroup = this.formBuilder.group({
    api_key: ['', [Validators.required]],
    secret_key: ['', [Validators.required]],
    fund_name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(150)]
    ],
    currency: ['', [Validators.required]],
    cantidad_dias: ['', [Validators.required]],
    take_profit: [
      '',
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern('[0-9][^.a-zA-Z]*$')
      ]
    ],
    stop_loss: [
      '',
      [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
        Validators.pattern('[0-9][^.a-zA-Z]*$')
      ]
    ],
    risk_level: ['', [Validators.required]]
  });

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private apiFunds: ApiFundsService,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.action = this.route.snapshot.paramMap.get('action');
    this.setPageByAction();
  }

  saveNew() {
    this.apiFunds.crud
      .create(this.form.value)
      .subscribe(() => this.success());
  }

  edit() {
    this.apiFunds.crud
      .update(this.getForUpdate(), this.fundForUpdate.id)
      .subscribe(() => this.success());
  }

  getForUpdate() {
    return {
      ...this.form.value,
      cantidad_dias: this.form.get('cantidad_dias').value,
      currency: this.form.get('currency').value,
      risk_level: this.form.get('risk_level').value,
      id_corrida: this.fundForUpdate.id_corrida
    };
  }

  saveRenew() {
    this.apiFunds
      .renewFund(this.form.value)
      .subscribe(() => this.success());
  }

  private success() {
    this.navController.pop().then(() => {
      this.toastService.showToast({
        message: this.translate.instant(
          `funds.new_fund.success_text_${this.action}`
        )
      });
      this.form.reset();
    });
  }

  save() {
    if (this.form.valid) {
      switch (this.action) {
        case FundFormActions.RenewFund:
          this.saveRenew();
          break;
        case FundFormActions.NewFund:
          this.saveNew();
          break;
        case FundFormActions.EditProfitLoss:
          this.edit();
          break;
      }
    }
  }

  async openBinanceAPIKeys() {
    const modal = await this.modalController.create({
      component: BinanceApikeyTutorialModalComponent
    });
    await modal.present();
  }

  setPageByAction() {
    switch (this.action) {
      case FundFormActions.RenewFund:
        this.setRenewAction();
        break;
      case FundFormActions.EditProfitLoss:
        this.setEditAction();
        break;
    }
  }

  private setEditAction() {
    this.removeKeys();
    this.form.updateValueAndValidity();
    this.form.get('fund_name').setValue(this.fundName);
    this.apiFunds.getFundRuns('active', this.fundName).subscribe((res: any) => {
      this.fundForUpdate = {...res[0]};
      this.form.patchValue(res[0]);
      this.form.get('take_profit').setValue(res[0].ganancia);
      this.form.get('stop_loss').setValue(res[0].perdida);
      this.form.get('risk_level').setValue(res[0].nivel_de_riesgo);
      this.form.get('cantidad_dias').disable();
      this.form.get('currency').disable();
      this.form.get('risk_level').disable();
    });
  }

  private setRenewAction() {
    this.removeKeys();
    this.form.get('fund_name').setValue(this.fundName);
    this.form.updateValueAndValidity();
  }

  private removeKeys() {
    this.form.removeControl('api_key');
    this.form.removeControl('secret_key');
  }
}
