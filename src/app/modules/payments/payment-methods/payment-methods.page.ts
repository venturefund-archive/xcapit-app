import { Component, OnInit } from '@angular/core';
import { ApiPaymentsService } from 'src/app/modules/payments/shared-payments/services/api-payments.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-methods',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/payment/select-license"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'payment.methods.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="ux_main">
        <div class="pm__title ux-font-text-xl">
          <ion-text>{{ 'payment.methods.title' | translate }}</ion-text>
        </div>
        <div class="ux_content">
          <div>
            <ion-list>
              <app-method *ngFor="let method of paymentMethods" [paymentMethod]="method" [planID]="this.planID">
              </app-method>
            </ion-list>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {
  planID: string;
  paymentMethods = [];
  constructor(private apiPayment: ApiPaymentsService, private route: ActivatedRoute) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.planID = this.route.snapshot.paramMap.get('plan_id');
    this.apiPayment.getPaymentMethods().subscribe((res) => {
      this.paymentMethods = res.filter((method) => method.status !== 'inactive');
    });
  }
}
