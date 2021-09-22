import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastAlertComponent } from 'src/app/shared/components/new-toasts/toast-alert/toast-alert.component';
import { CustomStopLossSettingComponent } from '../custom-stop-loss-setting/custom-stop-loss-setting.component';

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
              <ion-radio-group [value]="this.selected">
                <div class="container">
                  <ion-item (click)="this.openCustomClassicSL('classic')">
                    <ion-label>{{ 'funds.fund_stop_loss.classic_stop_loss' | translate }}</ion-label>
                    <ion-radio mode="md" slot="start" value="classic"></ion-radio>
                    <ion-button
                      *ngIf="this.selected === 'classic'"
                      appTrackClick
                      class="ux_button custom"
                      name="Edit Custom Stop Loss"
                      fill="clear"
                      color="uxsecondary"
                      >{{ 'funds.fund_stop_loss.edit_custom' | translate }}</ion-button
                    >
                  </ion-item>
                </div>
                <div class="container" (click)="this.openCustomInteligentSL('inteligent')">
                  <ion-item>
                    <ion-label>{{ 'funds.fund_stop_loss.inteligent_stop_loss' | translate }}</ion-label>
                    <ion-radio mode="md" slot="start" value="inteligent"></ion-radio>
                    <ion-badge *ngIf="this.selected !== 'inteligent'" class="ux_badge_primary" slot="end">{{
                      'funds.fund_stop_loss.most_chosen' | translate
                    }}</ion-badge>
                    <ion-button
                      *ngIf="this.selected === 'inteligent'"
                      appTrackClick
                      class="ux_button custom"
                      name="Edit Custom Stop Loss"
                      fill="clear"
                      color="uxsecondary"
                      >{{ 'funds.fund_stop_loss.edit_custom' | translate }}</ion-button
                    >
                  </ion-item>
                </div>
                <div class="container">
                  <ion-item (click)="this.openModalAlert('withoutSL')">
                    <ion-label>{{ 'funds.fund_stop_loss.without_stop_loss' | translate }}</ion-label>
                    <ion-radio mode="md" slot="start" value="withoutSL"></ion-radio>
                  </ion-item>
                </div>
                <!-- <div class="list-divider" *ngIf="!last || !this.customSL"></div> -->
              </ion-radio-group>
            </ion-list>
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
  @Input() trainlingStop?: number;
  @Input() profile: string;
  @Output() save = new EventEmitter<any>();
  customSL: boolean;
  mostChosenSL: number;
  selected: string;
  form: FormGroup = this.formBuilder.group({
    stop_loss: [''],
    trailing_stop: [''],
  });

  opTypeLabels = {
    submitButton: {
      renew: 'funds.fund_stop_loss.submit_button_renew',
      new: 'funds.fund_stop_loss.submit_button',
      edit: 'funds.fund_stop_loss.submit_button_edit',
    },
  };

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private apiFunds: ApiFundsService,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    // this.addManualOptionIfApplies();
    if (this.stopLoss) {
      this.form.patchValue({ stop_loss: this.stopLoss });
    }

    this.getMostChosenSL();
  }

  // addManualOptionIfApplies() {
  //   if (this.profile && this.profile.includes('index')) {
  //     this.stopLossOptions.push(this.stopLossManualOption);
  //   }
  // }

  getMostChosenSL() {
    this.apiFunds.getMostChosenSL().subscribe((data) => (this.mostChosenSL = data));
  }

  async openCustomClassicSL(option: string) {
    const modal = await this.modalController.create({
      component: CustomStopLossSettingComponent,
      componentProps: {
        value: this.form.value.stop_loss,
        title: this.translate.instant('funds.fund_stop_loss.title_classicSL'),
        message: this.translate.instant('funds.fund_stop_loss.message_classicSL'),
      },
      cssClass: 'ux_modal_stop_loss',
    });

    await modal.present();
    const data = await modal.onDidDismiss();
    if (!data.data) {
      this.selected = '';
      this.form.patchValue({ stop_loss: data.data });
      this.form.patchValue({ trailing_stop: 0 });
    }
  }

  async openCustomInteligentSL(option: string) {
    const modal = await this.modalController.create({
      component: CustomStopLossSettingComponent,
      componentProps: {
        value: this.form.value.stop_loss,
        title: this.translate.instant('funds.fund_stop_loss.title_inteligentSL'),
        message: this.translate.instant('funds.fund_stop_loss.message_inteligentSL'),
      },
      cssClass: 'ux_modal_stop_loss',
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    if (!data.data) {
      this.selected = '';
      this.form.patchValue({ stop_loss: data.data });
      this.form.patchValue({ trailing_stop: data.data });
    }
  }

  handleSubmit() {
    const values = { stop_loss: this.form.value.stop_loss };
    if (this.form.value.trailing_stop !== 0) {
      Object.assign(values, { trailing_stop: this.form.value.trailing_stop });
    }
    this.save.emit(this.form.value);
  }

  getParsedValues(formValues) {
    const valuesCopy = Object.assign({}, formValues);
    valuesCopy.genero = valuesCopy.genero.name;
    valuesCopy.estado_civil = valuesCopy.estado_civil.name;
    valuesCopy.tipo_doc = valuesCopy.tipo_doc.name;
    return valuesCopy;
  }

  async openModalAlert(option: string) {
    this.selected = option;
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
    this.form.patchValue({ stop_loss: 100 });
    this.form.patchValue({ trailing_stop: 0 });
    await modal.present();
  }
}
