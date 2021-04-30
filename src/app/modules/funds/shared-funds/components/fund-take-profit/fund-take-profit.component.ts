import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';
import { CustomRangeModalComponent } from 'src/app/modules/funds/shared-funds/components/custom-range-modal/custom-range-modal.component';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-select-take-profit',
  template: `<ion-content class="ion-padding">
    <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
      <div class="ux_content">
        <div class="ftp__title" *ngIf="this.opType !== 'edit'">
          <app-ux-title>{{ 'funds.fund_take_profit.title' | translate }}</app-ux-title>
        </div>
        <div class="ftp__text_before" *ngIf="this.opType !== 'edit'">
          <app-ux-text>
            {{ 'funds.fund_take_profit.text_before' | translate }}
          </app-ux-text>
        </div>
        <div class="ftp__input">
          <app-ux-radio-group [label]="'funds.fund_take_profit.take_profit' | translate">
            <ion-list>
              <ion-radio-group formControlName="take_profit">
                <div
                  *ngFor="let tp of this.takeProfitsOptions; let last = last"
                  class="container"
                  [ngClass]="{ custom: tp.custom }"
                >
                  <ion-item>
                    <ion-label>{{ tp.name }}</ion-label>
                    <ion-radio mode="md" slot="start" [value]="tp.value"></ion-radio>
                    <ion-badge *ngIf="tp.value === this.mostChosenTP" class="ux_badge_primary" slot="end">{{
                      'funds.fund_take_profit.most_chosen' | translate
                    }}</ion-badge>
                  </ion-item>
                  <ion-button
                    *ngIf="tp.custom"
                    appTrackClick
                    class="ux_button"
                    name="Edit Custom Take Profit"
                    fill="clear"
                    color="uxsecondary"
                    (click)="this.openCustomTP()"
                    >{{ 'funds.fund_take_profit.edit_custom' | translate }}</ion-button
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
                        {{ 'funds.fund_take_profit.custom_tp_button' | translate }}
                      </ion-button>
                    </div>
                  </ion-item>
                </div>
              </ion-radio-group>
            </ion-list>
            <app-errors-form-item controlName="take_profit"></app-errors-form-item>
          </app-ux-radio-group>
        </div>
      </div>

      <div class="ux_footer">
        <div class="ftp__buttons" *ngIf="this.opType !== 'edit'">
          <div class="ftp__back_button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Back"
              type="button"
              color="uxsecondary"
              size="large"
              fill="clear"
              (click)="this.goBack()"
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
              [disabled]="this.submitButtonService.isDisabled | async"
            >
              {{ 'funds.fund_take_profit.next_button' | translate }}
            </ion-button>
          </div>
        </div>
        <div class="ftp__buttons_edit" *ngIf="this.opType === 'edit'">
          <ion-button
            class="ux_button"
            appTrackClick
            name="Edit Fund"
            type="submit"
            color="uxsecondary"
            size="large"
            [disabled]="this.submitButtonService.isDisabled | async"
          >
            {{ 'funds.fund_take_profit.submit_button_edit' | translate }}
          </ion-button>
        </div>
      </div>
    </form>
  </ion-content>`,
  styleUrls: ['./fund-take-profit.component.scss'],
})
export class FundTakeProfitComponent implements OnInit {
  @Input() opType: any;
  @Input() takeProfit?: number;
  @Output() save = new EventEmitter<any>();

  form: FormGroup = this.formBuilder.group({
    take_profit: ['', [Validators.required, Validators.min(1), Validators.pattern('[0-9][^.a-zA-Z]*$')]],
  });

  mostChosenTP: number;

  takeProfitsOptions = [
    { name: '+5%', value: 5, custom: false },
    { name: '+10%', value: 10, custom: false },
    { name: '+15%', value: 15, custom: false },
  ];

  customTP = false;

  fundRenew: any;

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private apiFunds: ApiFundsService,
    private modalController: ModalController,
    private navController: NavController
  ) {}

  ngOnInit() {
    if (this.takeProfit) {
      if (!this.existsInRadio(this.takeProfit)) {
        this.addCustom(this.takeProfit);
      }
      this.form.patchValue({ take_profit: this.takeProfit });
    }
    this.getMostChosenTP();
  }

  getMostChosenTP() {
    this.apiFunds.getMostChosenTP().subscribe((data) => (this.mostChosenTP = data));
  }

  async openCustomTP() {
    const modal = await this.modalController.create({
      component: CustomRangeModalComponent,
      componentProps: { selected: this.form.value.take_profit },
      cssClass: 'ux_modal_crm',
    });

    await modal.present();
    const data = await modal.onDidDismiss();

    if (data.role === 'selected') {
      // Si no existe creo el nuevo item
      if (this.existsInRadio(data.data)) {
        this.removeCustom();
      } else {
        this.addCustom(data.data);
      }
      this.form.patchValue({ take_profit: data.data });
    }
  }

  existsInRadio(takeProfit: number) {
    return this.takeProfitsOptions.some((item) => item.value === takeProfit && !item.custom);
  }

  removeCustom() {
    const customIndex = this.takeProfitsOptions.findIndex((item) => item.custom);
    if (customIndex !== -1) {
      this.takeProfitsOptions.splice(customIndex, 1);
      this.customTP = false;
    }
  }

  addCustom(value: number) {
    const custom = {
      name: `+${value}%`,
      value,
      custom: true,
    };
    const customIndex = this.takeProfitsOptions.findIndex((item) => item.custom);
    if (customIndex !== -1) {
      this.takeProfitsOptions[customIndex] = custom;
    } else {
      this.takeProfitsOptions.push(custom);
    }
    this.customTP = true;
  }

  handleSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  goBack() {
    this.navController.navigateBack(['funds/fund-investment']);
  }
}
