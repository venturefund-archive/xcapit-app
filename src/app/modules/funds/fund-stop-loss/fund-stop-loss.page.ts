import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { NavController, ModalController } from '@ionic/angular';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { CustomRangeModalComponent } from '../shared-funds/components/custom-range-modal/custom-range-modal.component';

@Component({
  selector: 'app-fund-stop-loss',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="/funds/fund-take-profit"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'funds.fund_stop_loss.header' | translate
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
          <div class="fsl__title">
            <app-ux-title>{{
              'funds.fund_stop_loss.title' | translate
            }}</app-ux-title>
          </div>
          <div class="fsl__text_before">
            <app-ux-text>
              {{ 'funds.fund_stop_loss.text_before' | translate }}
            </app-ux-text>
          </div>
          <div class="fsl__input">
            <app-ux-radio-group
              [label]="'funds.fund_stop_loss.stop_loss' | translate"
            >
              <ion-list>
                <ion-radio-group formControlName="stop_loss">
                  <ion-item *ngFor="let sl of this.stopLossOptions">
                    <ion-label>{{ sl.name }}</ion-label>
                    <ion-radio
                      mode="md"
                      slot="start"
                      [value]="sl.value"
                    ></ion-radio>
                    <ion-badge
                      *ngIf="sl.value == this.mostChosenTP"
                      class="ux_badge_primary"
                      slot="end"
                      >{{
                        'funds.fund_stop_loss.most_chosen' | translate
                      }}</ion-badge
                    >
                  </ion-item>
                  <ion-item *ngIf="!this.customSL">
                    <div class="fsl__input__custom_tp_button">
                      <ion-button
                        class="ux_button"
                        appTrackClick
                        name="Back"
                        type="button"
                        color="uxsecondary"
                        fill="clear"
                        expand="block"
                        (click)="this.openCustomSL()"
                      >
                        {{
                          'funds.fund_stop_loss.custom_tp_button' | translate
                        }}
                      </ion-button>
                    </div>
                  </ion-item>
                  <ion-item [hidden]="!this.customSL">
                    <ion-label>+{{ this.customSL }}%</ion-label>
                    <ion-radio
                      appTrackClick
                      mode="md"
                      slot="start"
                      (click)="this.openCustomSL()"
                      [value]="this.customSL"
                      checked
                      [dataToTrack]="{ eventLabel: 'Edit Custom Take Profit' }"
                    ></ion-radio>
                    <ion-button
                      class="ux_button"
                      name="Back"
                      slot="end"
                      fill="clear"
                      color="uxsecondary"
                      >{{
                        'funds.fund_stop_loss.edit_custom' | translate
                      }}</ion-button
                    >
                  </ion-item>
                </ion-radio-group>
              </ion-list>
              <app-errors-form-item
                controlName="stop_loss"
              ></app-errors-form-item>
            </app-ux-radio-group>
          </div>
        </div>
        <div class="ux_footer">
          <div class="fsl__buttons">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Create Fund"
              type="submit"
              color="uxsecondary"
              size="large"
              [disabled]="!this.form.valid"
            >
              {{ 'funds.fund_stop_loss.submit_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./fund-stop-loss.page.scss']
})
export class FundStopLossPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    stop_loss: [
      '',
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern('[0-9][^.a-zA-Z]*$')
      ]
    ]
  });

  mostChosenTP;

  stopLossOptions = [
    { name: '+5%', value: 5 },
    { name: '+10%', value: 10 },
    { name: '+15%', value: 15 }
  ];

  customSL;

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
      if (!this.existsInRadio(data.stop_loss)) {
        this.customSL = data.stop_loss;
      }
    });
    this.getMostChosenTP();
  }

  getMostChosenTP() {
    this.apiFunds
      .getMostChosenTP()
      .subscribe(data => (this.mostChosenTP = data));
  }

  async openCustomSL() {
    const modal = await this.modalController.create({
      component: CustomRangeModalComponent,
      componentProps: { selected: this.form.value.stop_loss },
      cssClass: 'ux_modal_crm'
    });

    modal.onDidDismiss().then(data => {
      // Si no existe creo el nuevo item
      if (this.existsInRadio(data.data)) {
        this.customSL = null;
      } else {
        this.customSL = data.data;
      }
      this.form.patchValue({ stop_loss: data.data });
    });
    await modal.present();
  }

  existsInRadio(stopLoss) {
    return this.stopLossOptions.some(item => item.value === stopLoss);
  }

  async handleSubmit() {
    if (this.form.valid) {
      const fund = {
        ...(await this.fundDataStorage.getFund()),
        ...this.form.value
      };
      // TODO: Verificar bien que hacer con los niveles de riesgo
      if (fund.risk_level === 'MID') {
        fund.risk_level = 'PRO';
      }
      this.apiFunds.crud.create(fund).subscribe(() => {
        this.navController.navigateForward(['funds/fund-success']).then(() => {
          this.fundDataStorage.clearAll();
        });
      });
    }
  }
}
