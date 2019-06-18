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

@Component({
  selector: 'app-new-fund',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Nuevo Fondo</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form [formGroup]="this.form" (ngSubmit)="this.save()">
        <ion-item-group class="ion-padding-top">
          <ion-item-divider>
            <ion-label>Binance API Keys</ion-label>
          </ion-item-divider>

          <div class="ion-padding-start ion-padding-end">
            <ion-item>
              <ion-label position="floating">Binance API Key</ion-label>
              <ion-input formControlName="api_key" type="text"></ion-input>
            </ion-item>
            <app-errors-form-item controlName="api_key"></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">Binance Secret Key</ion-label>
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
              Mira como obtener las API y Secret key
              <a class="local-a" (click)="this.openBinanceAPIKeys()">aquí.</a>
            </p>
          </div>
        </ion-item-group>

        <ion-item-group class="ion-padding-top">
          <ion-item-divider>
            <ion-label>Fondo</ion-label>
          </ion-item-divider>

          <div class="ion-padding-start ion-padding-end">
            <ion-item>
              <ion-label position="floating">Nombre del Fondo</ion-label>
              <ion-input formControlName="fund_name" type="text"></ion-input>
            </ion-item>
            <app-errors-form-item
              controlName="fund_name"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">Moneda de Visualización</ion-label>
              <ion-select formControlName="currency">
                <ion-select-option>BTC</ion-select-option>
                <ion-select-option>USD</ion-select-option>
              </ion-select>
            </ion-item>
            <app-errors-form-item controlName="currency"></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">Plazo de Operación</ion-label>
              <ion-select formControlName="cantidad_dias">
                <ion-select-option value="30">30 días</ion-select-option>
                <ion-select-option value="60">60 días</ion-select-option>
                <ion-select-option value="90">90 días</ion-select-option>
              </ion-select>
            </ion-item>
            <app-errors-form-item
              controlName="cantidad_dias"
            ></app-errors-form-item>
            <ion-item>
              <ion-label position="floating">Take Profit</ion-label>
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
              <ion-label position="floating">Stop Loss</ion-label>
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
              <ion-label position="floating">Nivel de Riesgo</ion-label>
              <ion-select formControlName="risk_level">
                <ion-select-option>PRO</ion-select-option>
                <ion-select-option>CLASSIC</ion-select-option>
              </ion-select>
            </ion-item>
            <app-errors-form-item controlName="risk_level"></app-errors-form-item>
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
            Crear Fondo
          </ion-button>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./new-fund.page.scss']
})
export class NewFundPage implements OnInit {

  onlyIntegersErrors: ItemFormError[] = CONFIG.fieldErrors.onlyIntegers;

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
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  save() {
    if (this.form.valid) {
      this.apiFunds.crud.create(this.form.value).subscribe(() => {
        this.navController.navigateForward(['funds/list']).then(() => {
          this.toastService.showToast({
            message: 'El Fondo se creo correctamente!'
          });
          this.form.reset();
        });
      });
    }
  }

  async openBinanceAPIKeys() {
    const modal = await this.modalController.create({
      component: BinanceApikeyTutorialModalComponent
    });
    await modal.present();
  }
}
