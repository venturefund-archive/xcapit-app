import { Component, Input, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ApiPaymentsService } from 'src/app/modules/payments/shared-payments/services/api-payments.service';

const { Browser } = Plugins;
@Component({
  selector: 'app-method',
  template: `
    <div
      class="mc"
      appTrackClick
      [dataToTrack]="{ description: this.paymentMethod?.name }"
      name="Payment Method Select"
      (click)="openLink(this.paymentMethod?.id, this.planID)"
    >
      <div class="mc__content">
        <div class="mc__content__both">
          <div class="mc__content__img">
            <ion-img [src]="this.paymentImage"></ion-img>
          </div>
          <div class="mc__content__name_description">
            <div class="mc__content__name">
              <div class="ux-font-text-base">
                <ion-text>{{ this.paymentMethod?.name }} </ion-text>
              </div>
            </div>
            <div class="mc__content__description">
              <ion-text class="ux-font-text-xs" color="uxdark">{{
                this.paymentMethod?.description | translate
              }}</ion-text>
            </div>
          </div>
        </div>
        <div class="mc__content__button">
          <div class="button">
            <ion-button
              *ngIf="this.paymentMethod?.status === 'active'"
              name="Payment Method Select"
              fill="clear"
              color="uxmedium"
              size="small"
              slot="end"
              class="ux-font-text-xs"
            >
              <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
            </ion-button>
            <ion-badge *ngIf="this.paymentMethod?.status === 'soon'" class="ux_badge_coming" slot="end"
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

  constructor(private apiPayment: ApiPaymentsService) {}

  ngOnInit() {
    this.getPaymentImage();
  }

  openLink(methodID: string, planID: string) {
    if (this.paymentMethod?.status === 'active') {
      this.apiPayment.getPaymentLink({ plan_id: planID, payment_method_id: methodID }).subscribe((res) => {
        if (res.link) {
          Browser.open({
            toolbarColor: '#ff9100',
            url: res.link,
          });
        }
      });
    }
  }

  getPaymentImage() {
    this.paymentImage = `../../../../assets/img/payment-methods/${this.paymentMethod?.name.toLowerCase()}.png`;
  }
}
