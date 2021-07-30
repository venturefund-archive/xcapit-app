import { Component, Input, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ApiPaymentsService } from 'src/app/modules/payments/shared-payments/services/api-payments.service';

const { Browser } = Plugins;
@Component({
  selector: 'app-method',
  template: `
    <div class="mc" (click)="openLink(this.paymentMethod?.id, this.planID)">
      <div class="mc__content">
        <div class="mc__content__both">
          <div class="mc__content__img">
            <ion-img [src]="this.paymentImage"></ion-img>
          </div>
          <div class="mc__content__name_description">
            <div class="mc__content__name">
              <div class="ux-font-lato ux-fweight-regular ux-fsize-22">
                <ion-text>{{ this.paymentMethod?.name }} </ion-text>
              </div>
            </div>
            <div class="mc__content__description">
              <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-14" color="uxmedium">{{
                this.paymentMethod?.description | translate
              }}</ion-text>
            </div>
          </div>
        </div>
        <div class="mc__content__button">
          <div class="button">
            <ion-button
              *ngIf="this.isActive"
              appTrackClick
              name="Payment Method"
              fill="clear"
              color="uxmedium"
              size="small"
              slot="end"
              class="ux-font-lato ux-fweight-semibold ux-fsize-14"
            >
              <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
            </ion-button>
            <ion-badge *ngIf="!this.isActive" class="ux_badge_coming" slot="end"
              >{{ 'payment.methods.coming_badge' | translate }}
            </ion-badge>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./method.component.scss'],
})
export class MethodComponent implements OnInit {
  @Input() paymentMethod: any;
  @Input() planID: any;
  paymentImage = '';
  buttonName = '';
  isActive: boolean;

  constructor(private apiPayment: ApiPaymentsService) {}

  ngOnInit() {
    console.log(this.paymentMethod);
    this.getPaymentImage();
    this.getButtonName();
    this.MethodIsActive();
  }

  openLink(methodID: string, planID: string) {
    this.apiPayment.getPaymentLink({ plan_id: planID, payment_method_id: methodID }).subscribe((res) => {
      if (res.link) {
        Browser.open({
          toolbarColor: '#ff9100',
          url: res.link,
        });
      }
    });
  }

  MethodIsActive() {
    this.isActive =
      this.paymentMethod?.name !== 'Binance' &&
      this.paymentMethod?.name !== 'BitPay' &&
      this.paymentMethod?.name !== 'PayPal';
  }

  getPaymentImage() {
    this.paymentImage = `../../../../assets/img/payment-methods/${this.paymentMethod?.name.toLowerCase()}.png`;
  }

  getButtonName() {
    this.buttonName = `Payment Method: ${this.paymentMethod?.name}`;
  }
}
