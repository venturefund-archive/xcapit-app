import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { Countries } from '../enums/countries.enum';
import { Buy } from '../enums/buy.enum';
import { Sell } from '../enums/sell.enum';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';


@Component({
  selector: 'app-operations-new',
  template: `
  <ion-header>
    <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
      <ion-buttons slot="start">
        <ion-back-button defaultHref="/fiat-ramps/operations-page"></ion-back-button>
      </ion-buttons>
      <ion-title class="ion-text-center">
        {{ 'fiat_ramps.ramp_initial.header' | translate }}
      </ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
      <div class="ux_content">
        <app-ux-title class="ion-padding-top ion-margin-top">
          <div class="ion-margin-top">
            {{ 'fiat_ramps.ramp_initial.title' | translate }}
          </div>
        </app-ux-title>

        <!-- Pais -->
        <app-ux-input-select
          [label]="'profiles.user_profile.country' | translate"
          [modalTitle]="'profiles.user_profile.country_placeholder' | translate"
          [placeholder]="'profiles.user_profile.country_placeholder' | translate"
          controlName="pais"
          [data]="this.countries"
        ></app-ux-input-select>

        <!-- Operaciones -->
        <app-ux-text class="ion-padding-top ion-margin-top">
          <div class="ion-margin-top">
            {{ 'fiat_ramps.ramp_initial.operation' | translate }}
          </div>
        </app-ux-text>

        <app-ux-radio-group [label]="">
          <ion-list>
            <ion-radio-group formControlName="type">
              <div class="container">
                <ion-item>
                  <ion-label>{{ 'fiat_ramps.ramp_initial.buy' | translate }}</ion-label>
                  <ion-radio
                    mode="md"
                    slot="start"
                    [value]="'cash-in'"
                    (click)="resetPair()"
                  ></ion-radio>
                </ion-item>
                <!--div class="list-divider"></div>
                <ion-item>
                  <ion-label>{{ 'fiat_ramps.ramp_initial.sell' | translate }}</ion-label>
                  <ion-radio
                    mode="md"
                    slot="start"
                    [value]="'cash-out'"
                    (click)="resetPair()"
                  ></ion-radio>
                </ion-item-->
              </div>
            </ion-radio-group>
          </ion-list>
          <app-errors-form-item
            controlName="type"
          ></app-errors-form-item>
        </app-ux-radio-group>

        <!-- pares -->
        <div *ngIf="this.form.value['type'] === 'cash-in'">
          <app-ux-text class="ion-padding-top ion-margin-top">
            <div class="ion-margin-top">
              {{ 'fiat_ramps.ramp_initial.pair_buy' | translate }}
            </div>
          </app-ux-text>

          <app-ux-radio-group [label]="">
            <ion-list>
              <ion-radio-group formControlName="par">
                <div
                  *ngFor="let par of this.buy_pair; let last = last"
                  class="container"
                >
                
                  <ion-item>
                    <ion-label>{{par.name}}</ion-label>
                    <ion-radio
                      mode="md"
                      slot="start"
                      [value]="par.id"
                      (click)="getQuotations()"
                    ></ion-radio>
                  </ion-item>
                  <div class="list-divider" *ngIf="!last"></div>
                </div>
              </ion-radio-group>
            </ion-list>
            <app-errors-form-item
              controlName="par"
            ></app-errors-form-item>
          </app-ux-radio-group>
        </div>

        <div *ngIf="this.form.value['type'] === 'cash-out'">
          <app-ux-text class="ion-padding-top ion-margin-top">
            <div class="ion-margin-top">
              {{ 'fiat_ramps.ramp_initial.pair_sell' | translate }}
            </div>
          </app-ux-text>

          <app-ux-radio-group [label]="">
            <ion-list>
              <ion-radio-group formControlName="par">
                <div
                  *ngFor="let par of this.sell_pair; let last = last"
                  class="container"
                >
                
                  <ion-item>
                    <ion-label>{{par.name}}</ion-label>
                    <ion-radio
                      mode="md"
                      slot="start"
                      [value]="par.id"
                      (click)="getQuotations()"
                    ></ion-radio>
                  </ion-item>
                  <div class="list-divider" *ngIf="!last"></div>
                </div>
              </ion-radio-group>
            </ion-list>
            <app-errors-form-item
              controlName="par"
            ></app-errors-form-item>
          </app-ux-radio-group>
        </div>

        <!-- monto y wallet -->
        <div *ngIf="this.form.value['par']">
          <app-ux-text class="ion-padding-top ion-margin-top">
            <div class="ion-margin-top">
              {{ 'fiat_ramps.ramp_initial.amount' | translate }}
            </div>
          </app-ux-text>

          <div class="ux-card">
            <div class="ux-card__amount">
              <!-- monto -->
              <ion-input class="ux-card__amount__amount"
                formControlName="amount_in"
                type="text"
                placeholder="{{ 'fiat_ramps.ramp_initial.amount_ars' | translate }} {{this.form.value['moneda_entrada']}}"
                (keyup)=this.setOutAmount()
              >
              </ion-input>

              <div class="ux-card__amount__info">
                <div>
                  {{ 'fiat_ramps.ramp_initial.amount_min' | translate }} <span class="ux-card__amount__info__description"> 200 ARS</span>
                </div>
                <div>
                  {{ 'fiat_ramps.ramp_initial.amount_max' | translate }} <span class="ux-card__amount__info__description"> 250.000 ARS</span>
                </div>
              </div>
            </div>

            <!-- precio seleccionado -->
            <app-ux-loading-block
              *ngIf="!this.changePrice"
              minSize="30px"
            ></app-ux-loading-block>
            <div class="ux-card__price" *ngIf="this.changePrice">
              1 {{ pairSplit[1] }} <span class="ux-card__price__dark"> {{ changePrice }} {{ pairSplit[0] }}</span>
            </div>
          </div>

          <!-- wallet -->
          <app-ux-loading-block
              *ngIf="!this.walletAddress.length > 0"
              minSize="30px"
            ></app-ux-loading-block>
          <app-ux-input-select
            [label]="'Wallet'"
            [modalTitle]="'Wallet'"
            [placeholder]="'Wallet'"
            controlName="wallet"
            [data]="this.walletAddress"
            [keyName]="'name'"
            [valueName]="'id'"
            *ngIf="this.walletAddress.length > 0"
          ></app-ux-input-select>
        </div>
      </div>

      <div class="ux_footer">
        <div class="button-next">
          <ion-button
            class="ux_button"
            appTrackClick
            name="Next"
            type="submit"
            color="uxsecondary"
            size="large"
          >
            {{ 'fiat_ramps.ramp_initial.next_button' | translate }}
          </ion-button>
        </div>
      </div>
      
    </form>
  </ion-content>
  `,
  styleUrls: ['./operations-new.page.scss'],
})
export class OperationsNewPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    pais: ['Argentina', [Validators.maxLength(150)]],
    type: ['cash-in', [Validators.required]],
    par: ['', [Validators.required]],
    currency_in: [null, [Validators.required]],
    currency_out: ['', [Validators.required]],
    amount_in: ['', [Validators.required]],
    amount_out: [null, [Validators.required]],
    wallet: ['', [Validators.required]],
    price_in: [null, [Validators.required]],
    price_out: [null, [Validators.required]]
  });

  countries = Object.values(Countries);
  buy_pair = Object.keys(Buy).map(key => ({ name: Buy[key], id: key }))
  sell_pair = Object.keys(Sell).map(key => ({ name: Sell[key], id: key }))
  quotations: any = null;
  changePrice = null;
  pairSplit = [];
  amount_out = null;
  walletAddress = [];

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private storageOperationService: StorageOperationService
  ) { }

  ngOnInit() {}
  
  resetPair() {
    this.form.controls['par'].setValue('');
    this.form.controls['amount_in'].setValue('');
    this.form.controls['price_out'].setValue('')
    this.form.controls['currency_in'].setValue('');
    this.form.controls['currency_out'].setValue('');
    this.form.controls['wallet'].setValue('');
  }

  handleSubmit() {
    if (this.form.valid) {
      this.setOperationStorage();
      this.checkUser();
    } else {
      this.form.markAllAsTouched();
    }
  }

  async getQuotations() {
    this.changePrice = '';
    this.walletAddress = [];
    this.form.controls['wallet'].setValue('');
    this.form.controls['amount_in'].setValue('');
    this.fiatRampsService.getQuotations()
    .subscribe((res) => {
      this.quotations = res.data;
      this.getPrice();
    })
  }

  async checkUser() {
    this.fiatRampsService.checkUser()
    .subscribe((res) => {
      if (!res.id) {
        this.createUser();
      } else {
        this.navController.navigateForward(['fiat-ramps/confirm-page']);
      }
    })
  }

  getPrice() {
    this.pairSplit = this.form.value['par'].split('_');
    this.form.controls['currency_in'].setValue(this.pairSplit[0]);
    this.form.controls['currency_out'].setValue(this.pairSplit[1]);
    this.pairSplit = (this.form.value['type'] === 'cash-out') ? this.pairSplit.reverse() : this.pairSplit;
    let price = this.quotations.filter(pair => pair.currency === this.pairSplit[1].toLowerCase());

    if(price[0]) {
      if (this.form.value['type'] === 'cash-in') {
        this.changePrice = price[0].quotation[this.pairSplit[0].toLowerCase()].sell;
        this.changePrice = parseFloat(this.changePrice.replaceAll(',',''));
        this.form.controls['price_in'].setValue(1)
        this.form.controls['price_out'].setValue(this.changePrice)

      } else {
        this.changePrice = price[0].quotation[this.pairSplit[0].toLowerCase()].buy
        this.changePrice = parseFloat(this.changePrice.replaceAll(',',''));
        this.form.controls['price_in'].setValue(1)
        this.form.controls['price_out'].setValue(this.changePrice)
      }
    }

    this.getUserWallets();
  }

  async createUser() {
    this.fiatRampsService.createUser()
    .subscribe({
      next: (res) => {
        this.navController.navigateForward(['fiat-ramps/user-information']);
      }
    })
  }

  setOperationStorage() {
    const data = this.form.value;
    this.storageOperationService.updateData(data);
  }

  setOutAmount() {
    this.amount_out = this.form.value['amount_in'] / this.changePrice;
    this.form.controls['amount_out'].setValue(this.amount_out);
  }

  async getUserWallets() {
    let wallets = [];
    this.fiatRampsService.getUserWallets(this.pairSplit[1])
    .subscribe((res) => {

      Object.keys(res).forEach((key, value) => {
        let l = Object.keys(res[key].wallets).map((wallet) => {
          return ({name: key + ' (' + wallet + ')', id: res[key].wallets[wallet]})
        })
        wallets = [...wallets, ...l]
      })

      this.walletAddress = Object.values(wallets);
    }); 
  }

}
