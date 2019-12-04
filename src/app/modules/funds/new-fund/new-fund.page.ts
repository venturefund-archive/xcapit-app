import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';
import { TranslateService } from '@ngx-translate/core';
import { Currency } from '../shared-funds/enums/currency.enum';
import { ActivatedRoute } from '@angular/router';
import { FundFormActions } from '../shared-funds/enums/fund-form-actions.enum';
import { Exchanges } from '../shared-funds/enums/exchanges.enum';
import { DynamicComponentService } from 'src/app/shared/services/dynamic-component/dynamic-component.service';
import { NewFundInfoComponent } from './components/new-fund-info/new-fund-info.component';

@Component({
  selector: 'app-new-fund',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ this.action | fundActionFormTitle | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-is-subscribed
        [disabled]="!this.fundName"
        [fundName]="this.fundName"
        redirectTo="/tabs/funds"
      >
        <form [formGroup]="this.form" (ngSubmit)="this.save()">
          <ion-item-group
            class="ion-padding-top"
            *ngIf="this.action === this.fundFormActions.NewFund"
          >
            <ion-item-divider>
              <ion-label>
                {{ 'funds.new_fund.ion_divider1' | translate }}
              </ion-label>
            </ion-item-divider>

            <div class="ion-padding-start ion-padding-end">
              <ion-item>
                <ion-label position="floating">
                  {{ 'funds.new_fund.exchange' | translate }}
                </ion-label>
                <ion-select formControlName="exchange">
                  <ion-select-option [value]="this.exchanges.Binance">
                    {{ this.exchanges.Binance }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
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
                <a
                  appTrackClick
                  name="Api Keys Tutorial"
                  class="local-a"
                  (click)="this.openAPIKeysTutorial()"
                >
                  {{ 'funds.new_fund.a1' | translate }}</a
                >
              </p>
            </div>
          </ion-item-group>

          <ion-item-group class="ion-padding-top">
            <ion-item-divider>
              <ion-buttons slot="end">
                <ion-button
                  appTrackClick
                  name="New Fund Form Info"
                  size="small"
                  (click)="this.openNewFormInfo()"
                >
                  <ion-icon
                    slot="icon-only"
                    name="information-circle-outline"
                  ></ion-icon>
                </ion-button>
              </ion-buttons>
              <ion-label>
                {{ 'funds.new_fund.ion_divider2' | translate }}
              </ion-label>
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
                <ion-select formControlName="currency">
                  <ion-select-option [value]="this.currencyEnum.BTC">
                    {{ this.currencyEnum.BTC }}
                  </ion-select-option>
                  <ion-select-option [value]="this.currencyEnum.USDT">
                    {{ this.currencyEnum.USDT }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
              <app-errors-form-item controlName="currency"></app-errors-form-item>
              <ion-item>
                <ion-label position="floating">{{
                  'funds.new_fund.cantidad_dias' | translate
                }}</ion-label>
                <ion-select formControlName="cantidad_dias">
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
                <ion-label>Trailing</ion-label>
                <ion-toggle
                  appTrackClick
                  [dataToTrack]="{ eventLabel: 'Toggle Trailing' }"
                  [trackOnlyClick]="true"
                  [checked]="this.hasTrailing"
                  (ionChange)="this.toggleTrailing($event)"
                ></ion-toggle>
              </ion-item>
              <div *ngIf="this.hasTrailing">
                <ion-item lines="inset">
                  <ion-label>Profit</ion-label>
                  <ion-range formControlName="trailing_profit" min="0" max="100">
                    <ion-label class="new-fund__trailing-label" slot="end">
                      {{ this.form.get('trailing_profit').value || '0' }}%
                    </ion-label>
                  </ion-range>
                </ion-item>
                <ion-item lines="inset">
                  <ion-label>Stop</ion-label>
                  <ion-range formControlName="trailing_stop" min="0" max="100">
                    <ion-label class="new-fund__trailing-label" slot="end">
                      {{ this.form.get('trailing_stop').value || '0' }}%
                    </ion-label>
                  </ion-range>
                </ion-item>
              </div>
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
              appTrackClick
              [dataToTrack]="{ description: this.action }"
              name="Save Fund"
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
      </app-is-subscribed>
    </ion-content>
  `,
  styleUrls: ['./new-fund.page.scss']
})
export class NewFundPage implements OnInit {
  fundFormActions = FundFormActions;
  onlyIntegersErrors: ItemFormError[] = CONFIG.fieldErrors.onlyIntegers;

  currencyEnum = Currency;
  exchanges = Exchanges;
  fundName: string;
  action: string;
  fundForUpdate: any;
  hasTrailing = false;

  form: FormGroup = this.formBuilder.group({
    exchange: [Exchanges.Binance, [Validators.required]],
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
    private route: ActivatedRoute,
    private dynamicComponentService: DynamicComponentService
  ) {}

  ngOnInit() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.action = this.route.snapshot.paramMap.get('action');
    this.setPageByAction();
  }

  saveNew() {
    this.apiFunds.crud.create(this.form.value).subscribe(() => this.success());
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
    this.apiFunds.renewFund(this.form.value).subscribe(() => this.success());
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

  async openNewFormInfo() {
    const modal = await this.modalController.create({
      component: NewFundInfoComponent
    });
    await modal.present();
  }

  async openAPIKeysTutorial() {
    const exchange = this.form.get('exchange').value || Exchanges.Binance;
    const component = this.dynamicComponentService.getComponent(
      `${exchange}ApikeyTutorialModalComponent`
    );
    const modal = await this.modalController.create({ component });
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

  toggleTrailing(event: CustomEvent) {
    this.hasTrailing = event.detail.checked;
    if (this.hasTrailing) {
      const validators = [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9][^.a-zA-Z]*$')
      ];
      this.form.addControl(
        'trailing_profit',
        new FormControl(0, [...validators])
      );
      this.form.addControl(
        'trailing_stop',
        new FormControl(0, [...validators])
      );
    } else {
      this.form.removeControl('trailing_profit');
      this.form.removeControl('trailing_stop');
    }
  }

  private setEditAction() {
    this.removeExchange();
    this.form.updateValueAndValidity();
    this.form.get('fund_name').setValue(this.fundName);
    this.apiFunds.getFundRuns('active', this.fundName).subscribe((res: any) => {
      if (Array.isArray(res) && res[0]) {
        this.fundForUpdate = { ...res[0] };
        if (
          this.fundForUpdate.trailing_stop ||
          this.fundForUpdate.trailing_profit
        ) {
          this.toggleTrailing({ detail: { checked: true } } as CustomEvent);
        }
        this.form.patchValue(this.fundForUpdate);
        this.form.get('take_profit').setValue(this.fundForUpdate.ganancia);
        this.form.get('stop_loss').setValue(this.fundForUpdate.perdida);
        this.form
          .get('risk_level')
          .setValue(this.fundForUpdate.nivel_de_riesgo);
        this.form.get('cantidad_dias').disable();
        this.form.get('currency').disable();
        this.form.get('risk_level').disable();
      }
    });
  }

  private setRenewAction() {
    this.removeExchange();
    this.form.get('fund_name').setValue(this.fundName);
    this.form.updateValueAndValidity();
  }

  private removeExchange() {
    this.form.removeControl('exchange');
    this.form.removeControl('api_key');
    this.form.removeControl('secret_key');
  }
}
