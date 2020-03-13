import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { NavController, ModalController } from '@ionic/angular';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { CustomRangeModalComponent } from '../shared-funds/components/custom-range-modal/custom-range-modal.component';

@Component({
  selector: 'app-fund-take-profit',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/fund-currency"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'funds.fund_take_profit.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form
        [formGroup]="this.form"
        (ngSubmit)="this.handleSubmit()"
        class="ux_main"
      >
        <div class="ux_content">
          <div class="ftp__title">
            <app-ux-title>{{
              'funds.fund_take_profit.title' | translate
            }}</app-ux-title>
          </div>
          <div class="ftp__text_before">
            <app-ux-text>
              {{ 'funds.fund_take_profit.text_before' | translate }}
            </app-ux-text>
          </div>
          <div class="ftp__input">
            <app-ux-radio-group
              [label]="'funds.fund_take_profit.take_profit' | translate"
            >
              <ion-list>
                <ion-radio-group formControlName="take_profit">
                  <div
                    *ngFor="let tp of this.takeProfitsOptions; let last = last"
                    class="container"
                    [ngClass]="{ custom: tp.custom }"
                  >
                    <ion-item>
                      <ion-label>{{ tp.name }}</ion-label>
                      <ion-radio
                        mode="md"
                        slot="start"
                        [value]="tp.value"
                      ></ion-radio>
                      <ion-badge
                        *ngIf="tp.value == this.mostChosenTP"
                        class="ux_badge_primary"
                        slot="end"
                        >{{
                          'funds.fund_take_profit.most_chosen' | translate
                        }}</ion-badge
                      >
                    </ion-item>
                    <ion-button
                      *ngIf="tp.custom"
                      appTrackClick
                      class="ux_button"
                      name="Edit Custom Take Profit"
                      fill="clear"
                      color="uxsecondary"
                      (click)="this.openCustomTP()"
                      >{{
                        'funds.fund_take_profit.edit_custom' | translate
                      }}</ion-button
                    >
                    <div class="list-divider" *ngIf="!last || !this.customTP"></div>
                  </div>
                  <div>
                    <ion-item [hidden]="this.customTP">
                      <div class="ftp__input__custom_tp_button">
                        <ion-button
                          class="ux_button"
                          appTrackClick
                          name="Back"
                          type="button"
                          color="uxsecondary"
                          fill="clear"
                          expand="block"
                          (click)="this.openCustomTP()"
                        >
                          {{
                            'funds.fund_take_profit.custom_tp_button'
                              | translate
                          }}
                        </ion-button>
                      </div>
                    </ion-item>
                  </div>
                </ion-radio-group>
              </ion-list>
              <app-errors-form-item
                controlName="take_profit"
              ></app-errors-form-item>
            </app-ux-radio-group>
          </div>
        </div>

        <div class="ux_footer">
          <div class="ftp__buttons">
            <div class="ftp__back_button">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Back"
                type="button"
                color="uxsecondary"
                size="large"
                fill="clear"
                routerLink="/funds/fund-currency"
                routerDirection="backward"
              >
                {{ 'funds.fund_take_profit.back_button' | translate }}
              </ion-button>
            </div>
            <div class="ftp__next_button">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Save Fund Take Profit"
                type="submit"
                color="uxsecondary"
                size="large"
                [disabled]="!this.form.valid"
              >
                {{ 'funds.fund_take_profit.next_button' | translate }}
              </ion-button>
            </div>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./fund-take-profit.page.scss']
})
export class FundTakeProfitPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    take_profit: [
      '',
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern('[0-9][^.a-zA-Z]*$')
      ]
    ]
  });

  mostChosenTP: number;

  takeProfitsOptions = [
    { name: '+5%', value: 5, custom: false },
    { name: '+10%', value: 10, custom: false },
    { name: '+15%', value: 15, custom: false }
  ];

  customTP: any;

  constructor(
    private fundDataStorage: FundDataStorageService,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private apiFunds: ApiFundsService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.fundDataStorage.getData('fundTakeProfit').then(data => {
      this.form.patchValue(data);
      if (!this.existsInRadio(data.take_profit)) {
        this.addCustom(data.take_profit);
      }
    });
    this.getMostChosenTP();
  }

  getMostChosenTP() {
    this.apiFunds
      .getMostChosenTP()
      .subscribe(data => (this.mostChosenTP = data));
  }

  async openCustomTP() {
    const modal = await this.modalController.create({
      component: CustomRangeModalComponent,
      componentProps: { selected: this.form.value.take_profit },
      cssClass: 'ux_modal_crm'
    });

    await modal.present();
    const data = await modal.onDidDismiss();

    // Si no existe creo el nuevo item
    if (this.existsInRadio(data.data)) {
      this.removeCustom();
    } else {
      this.addCustom(data.data);
    }
    this.form.patchValue({ take_profit: data.data });
  }

  existsInRadio(takeProfit: number) {
    return this.takeProfitsOptions.some(item => item.value === takeProfit);
  }

  removeCustom() {
    const customIndex = this.takeProfitsOptions.findIndex(item => item.custom);
    if (customIndex !== -1) {
      this.takeProfitsOptions.splice(customIndex, 1);
      this.customTP = false;
    }
  }

  addCustom(value: number) {
    const custom = {
      name: `+${value}%`,
      value,
      custom: true
    };
    const customIndex = this.takeProfitsOptions.findIndex(item => item.custom);
    if (customIndex !== -1) {
      this.takeProfitsOptions[customIndex] = custom;
    } else {
      this.takeProfitsOptions.push(custom);
    }
    this.customTP = true;
  }

  handleSubmit() {
    if (this.form.valid) {
      this.fundDataStorage.setData('fundTakeProfit', this.form.value);
      this.navController.navigateForward(['funds/fund-stop-loss']);
    }
  }
}
