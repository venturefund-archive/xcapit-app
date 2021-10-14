import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { TranslateService } from '@ngx-translate/core';
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
        <div class="fls__form">
          <app-ux-radio-group [label]="'funds.fund_stop_loss.stop_loss' | translate">
            <ion-list>
              <ion-radio-group [value]="this.selected">
                <div class="container">
                  <ion-item (click)="this.openCustomClassicSL('classicStopLoss')" name="classicStopLoss">
                    <ion-label>{{ 'funds.fund_stop_loss.classic_stop_loss' | translate }}</ion-label>
                    <ion-radio mode="md" slot="start" value="classicStopLoss"></ion-radio>
                    <ion-button
                      *ngIf="this.selected === 'classicStopLoss'"
                      appTrackClick
                      class="ux_button custom"
                      name="Edit Classic Stop Loss"
                      fill="clear"
                      color="uxsecondary"
                      >{{ 'funds.fund_stop_loss.edit_custom' | translate }}</ion-button
                    >
                  </ion-item>
                </div>
                <div
                  class="container"
                  (click)="this.openCustomInteligentSL('inteligentStopLoss')"
                  name="inteligentStopLoss"
                >
                  <ion-item>
                    <ion-label>{{ 'funds.fund_stop_loss.inteligent_stop_loss' | translate }}</ion-label>
                    <ion-radio mode="md" slot="start" value="inteligentStopLoss"></ion-radio>
                    <ion-badge *ngIf="this.selected !== 'inteligentStopLoss'" class="ux_badge_primary" slot="end">{{
                      'funds.fund_stop_loss.most_chosen' | translate
                    }}</ion-badge>
                    <ion-button
                      *ngIf="this.selected === 'inteligentStopLoss'"
                      appTrackClick
                      class="ux_button custom"
                      name="Edit Inteligent Stop Loss"
                      fill="clear"
                      color="uxsecondary"
                      >{{ 'funds.fund_stop_loss.edit_custom' | translate }}</ion-button
                    >
                  </ion-item>
                </div>
                <div class="container" *ngIf="this.isIndexProfile" name="withoutStopLoss">
                  <ion-item (click)="this.withoutSL('withoutStopLoss')" name="withoutStopLoss">
                    <ion-label>{{ 'funds.fund_stop_loss.without_stop_loss' | translate }}</ion-label>
                    <ion-radio mode="md" slot="start" value="withoutStopLoss"></ion-radio>
                  </ion-item>
                </div>
              </ion-radio-group>
            </ion-list>
          </app-ux-radio-group>
        </div>
        <div class="info-alert">
          <app-ux-alert-message type="info" *ngIf="this.isIndexProfile">{{
            'funds.fund_stop_loss.alert_manual_option' | translate
          }}</app-ux-alert-message>
        </div>
      </div>
      <div class="ux_footer">
        <div class="fsl__buttons">
          <ion-button
            class="ux-font-text-xs semibold"
            appTrackClick
            name="Information"
            color="uxprimary"
            size="large"
            fill="clear"
            (click)="this.goToInformationPage()"
          >
            {{ 'funds.fund_stop_loss.inteligent_stop_loss_info' | translate }}
          </ion-button>
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
  @Input() trailingStop?: number;
  @Input() profile: string;
  @Output() save = new EventEmitter<any>();
  customSL: boolean;
  mostChosenSL: number;
  selected: string;
  lastSelected: string;
  isIndexProfile: boolean;
  form: FormGroup = this.formBuilder.group({
    stop_loss: [''],
    trailing_stop: [''],
  });

  opTypeLabels = {
    submitButton: {
      renew: 'funds.fund_stop_loss.submit_button',
      new: 'funds.fund_stop_loss.submit_button',
      edit: 'funds.fund_stop_loss.submit_button_edit',
    },
  };

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private apiFunds: ApiFundsService,
    private modalController: ModalController,
    private translate: TranslateService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.addWithoutSLOptionIfApplies();
    if (this.stopLoss) {
      this.form.patchValue({ stop_loss: this.stopLoss });
    }
    if (this.trailingStop) {
      this.form.patchValue({ trailing_stop: this.trailingStop });
    }
    this.setRadio();
    this.getMostChosenSL();
  }

  setRadio() {
    if (this.trailingStop > 0) {
      this.selected = 'inteligentStopLoss';
    } else if (this.stopLoss === 100) {
      this.selected = 'withoutStopLoss';
    } else if (this.stopLoss) {
      this.selected = 'classicStopLoss';
    }
  }

  addWithoutSLOptionIfApplies() {
    if (this.profile && this.profile.includes('index')) {
      this.isIndexProfile = true;
    }
  }

  getMostChosenSL() {
    this.apiFunds.getMostChosenSL().subscribe((data) => (this.mostChosenSL = data));
  }

  async openCustomClassicSL(option: string) {
    const modal = await this.modalController.create({
      component: CustomStopLossSettingComponent,
      componentProps: {
        stopLoss: this.form.value.stop_loss,
        trailingStop: this.form.value.trailing_stop,
        title: this.translate.instant('funds.fund_stop_loss.title_classicSL'),
        message: this.translate.instant('funds.fund_stop_loss.message_classicSL'),
        type: 'classicSL',
      },
      cssClass: 'ux_modal_stop_loss',
    });

    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.data) {
      this.selected = option;
      this.form.patchValue({ stop_loss: data.data });
      this.form.patchValue({ trailing_stop: 0 });
    }
  }

  async openCustomInteligentSL(option: string) {
    const modal = await this.modalController.create({
      component: CustomStopLossSettingComponent,
      componentProps: {
        trailingStop: this.form.value.trailing_stop,
        stopLoss: this.form.value.stop_loss,
        title: this.translate.instant('funds.fund_stop_loss.title_inteligentSL'),
        message: this.translate.instant('funds.fund_stop_loss.message_inteligentSL'),
        type: 'inteligentSL',
      },
      cssClass: 'ux_modal_stop_loss',
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.data) {
      this.selected = option;
      this.form.patchValue({ stop_loss: data.data });
      this.form.patchValue({ trailing_stop: data.data });
    }
  }

  withoutSL(option: string) {
    this.selected = option;
    this.form.patchValue({ stop_loss: 100 });
    this.form.patchValue({ trailing_stop: 0 });
  }

  handleSubmit() {
    const values = { stop_loss: this.form.value.stop_loss };
    if (this.form.value.trailing_stop !== 0) {
      Object.assign(values, { trailing_stop: this.form.value.trailing_stop });
    }
    this.save.emit(values);
  }

  goToInformationPage() {
    this.navController.navigateForward(['funds/inteligent-stop-loss-information']);
  }
}
