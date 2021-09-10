import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';
import { CustomRangeModalComponent } from 'src/app/modules/funds/shared-funds/components/custom-range-modal/custom-range-modal.component';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastAlertComponent } from 'src/app/shared/components/new-toasts/toast-alert/toast-alert.component';

@Component({
  selector: 'app-fund-select-stop-loss',
  template: ` <ion-content class="ion-padding">
    <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
      <div class="ux_content">
        <div class="fsl__title" *ngIf="this.opType !== 'edit'">
          <app-ux-title>{{ 'funds.fund_stop_loss.title' | translate }}</app-ux-title>
        </div>
        <div class="fsl__text_before" *ngIf="this.opType !== 'edit'">
          <app-ux-text>
            {{ 'funds.fund_stop_loss.text_before' | translate }}
          </app-ux-text>
        </div>
        <div class="fsl__input">
          <app-ux-radio-group [label]="'funds.fund_stop_loss.stop_loss' | translate">
            <ion-list>
              <ion-radio-group formControlName="stop_loss" (ionChange)="this.ShowAlertIfManualSelected($event)">
                <div
                  *ngFor="let sl of this.stopLossOptions; let last = last"
                  class="container"
                  [ngClass]="{ custom: sl.custom }"
                >
                  <ion-item>
                    <ion-label>{{ sl.name }}</ion-label>
                    <ion-radio mode="md" slot="start" [value]="sl.value"></ion-radio>
                    <ion-badge *ngIf="sl.value === this.mostChosenSL" class="ux_badge_primary" slot="end">{{
                      'funds.fund_stop_loss.most_chosen' | translate
                    }}</ion-badge>
                  </ion-item>
                  <ion-button
                    *ngIf="sl.custom"
                    appTrackClick
                    class="ux_button"
                    name="Edit Custom Stop Loss"
                    fill="clear"
                    color="uxsecondary"
                    (click)="this.openCustomSL()"
                    >{{ 'funds.fund_stop_loss.edit_custom' | translate }}</ion-button
                  >
                  <div class="list-divider" *ngIf="!last || !this.customSL"></div>
                </div>
                <div>
                  <ion-item [hidden]="this.customSL">
                    <div class="fsl__input__custom_tp_button">
                      <ion-button
                        class="ux_button"
                        appTrackClick
                        name="Create Custom Stop Loss"
                        type="button"
                        color="uxsecondary"
                        fill="clear"
                        expand="block"
                        (click)="this.openCustomSL()"
                      >
                        {{ 'funds.fund_stop_loss.custom_tp_button' | translate }}
                      </ion-button>
                    </div>
                  </ion-item>
                </div>
              </ion-radio-group>
            </ion-list>
            <app-errors-form-item controlName="stop_loss"></app-errors-form-item>
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
            [disabled]="this.submitButtonService.isDisabled | async"
          >
            {{ this.opTypeLabels.submitButton[this.opType] | translate }}
          </ion-button>
        </div>
      </div>
    </form>
  </ion-content>`,
  styleUrls: ['./fund-stop-loss.component.scss'],
})
export class FundStopLossComponent implements OnInit {
  @Input() opType: any;
  @Input() stopLoss?: number;
  @Input() profile: string;
  @Output() save = new EventEmitter<any>();

  form: FormGroup = this.formBuilder.group({
    stop_loss: ['', [Validators.required, Validators.min(1), Validators.pattern('[0-9][^.a-zA-Z]*$')]],
  });

  mostChosenSL: number;

  opTypeLabels = {
    submitButton: {
      renew: 'funds.fund_stop_loss.submit_button_renew',
      new: 'funds.fund_stop_loss.submit_button',
      edit: 'funds.fund_stop_loss.submit_button_edit',
    },
  };

  stopLossOptions = [
    { name: '-5%', value: 5, custom: false },
    { name: '-10%', value: 10, custom: false },
    { name: '-15%', value: 15, custom: false },
  ];

  stopLossManualOption = {
    name: this.translate.instant('funds.fund_take_profit.manual_stop'),
    value: 100,
    custom: false,
  };

  customSL: boolean;

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private apiFunds: ApiFundsService,
    private modalController: ModalController,
    private translate: TranslateService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.addManualOptionIfApplies();

    if (this.stopLoss) {
      if (!this.existsInRadio(this.stopLoss)) {
        this.addCustom(this.stopLoss);
      }
      this.form.patchValue({ stop_loss: this.stopLoss });
    }

    this.getMostChosenSL();
  }

  addManualOptionIfApplies() {
    if (this.profile && this.profile.includes('index')) {
      this.stopLossOptions.push(this.stopLossManualOption);
    }
  }

  getMostChosenSL() {
    this.apiFunds.getMostChosenSL().subscribe((data) => (this.mostChosenSL = data));
  }

  async openCustomSL() {
    const modal = await this.modalController.create({
      component: CustomRangeModalComponent,
      componentProps: {
        selected: this.form.value.stop_loss,
        max: 100,
        min: 3,
      },
      cssClass: 'ux_modal_crm',
    });

    await modal.present();
    const data = await modal.onDidDismiss();

    if (data.role === 'selected') {
      if (this.existsInRadio(data.data)) {
        this.removeCustom();
      } else {
        this.addCustom(data.data);
      }
      this.form.patchValue({ stop_loss: data.data });
    }
  }

  existsInRadio(stopLoss) {
    return this.stopLossOptions.some((item) => item.value === stopLoss && !item.custom);
  }

  removeCustom() {
    const customIndex = this.stopLossOptions.findIndex((item) => item.custom);
    if (customIndex !== -1) {
      this.stopLossOptions.splice(customIndex, 1);
      this.customSL = false;
    }
  }

  addCustom(value: number) {
    const custom = {
      name: `-${value}%`,
      value,
      custom: true,
    };
    const customIndex = this.stopLossOptions.findIndex((item) => item.custom);
    if (customIndex !== -1) {
      this.stopLossOptions[customIndex] = custom;
    } else {
      this.stopLossOptions.push(custom);
    }
    this.customSL = true;
  }

  handleSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  ShowAlertIfManualSelected(event) {
    if (event.detail.value === 100) {
      this.openModalAlert();
    }
  }
  async openModalAlert() {
    const modal = await this.modalController.create({
      component: ToastAlertComponent,
      cssClass: 'ux-alert',
      showBackdrop: false,
      componentProps: {
        title: this.translate.instant('funds.fund_stop_loss.alert_manual_option'),
        type: 'information',
        detailsEnabled: false,
      },
    });
    await modal.present();
  }
}
