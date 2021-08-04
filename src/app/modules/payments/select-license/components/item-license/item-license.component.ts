import { Component, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PlanType } from '../../enums/plan_type.enum';

@Component({
  selector: 'app-item-license',
  template: ` <div class="ilc">
    <div class="ilc__content">
      <div *ngIf="this.plan?.type === planType.premium" class="image">
        <img src="../assets/ux-icons/ux-corone.png" alt="premium logo" />
      </div>
      <div
        *ngIf="this.plan?.type === planType.free || this.plan?.type === planType.paid"
        class="ilc__content__name ux-font-gilroy ux-fweight-bold ux-fsize-14 "
      >
        <input class="input_radio" type="radio" name="select" id="select" value="select" />
        <label class="ilc__content__name__license" for="select">{{ this.plan?.name }}</label>
      </div>
      <div
        *ngIf="this.plan?.type === planType.premium"
        class="ilc__content__name ux-font-gilroy ux-fweight-bold ux-fsize-14 "
      >
        <label class="ilc__content__name__premium" for="select">{{ this.plan?.name }}</label>
      </div>
      <div class="ilc__content__description">
        <div class="ux-font-lato ux-fweight-regular ux-fsize-14">
          <ion-text class="info_text">{{ this.plan?.info | translate }}</ion-text>
        </div>
      </div>
      <div *ngIf="this.plan?.type === planType.free || this.plan?.type === planType.paid" class="ilc__content__price">
        <div>
          <ion-text
            *ngIf="this.plan?.type === planType.free"
            class="license_text ux-font-gilroy ux-fweight-bold ux-fsize-15"
            color="uxdark"
            >{{ this.plan?.price | translate }}</ion-text
          >
          <ion-text
            *ngIf="this.plan?.type === planType.paid"
            class="license_text ux-font-gilroy ux-fweight-bold ux-fsize-15"
            color="uxdark"
            >{{ '$' + this.plan?.price }}</ion-text
          >
          <ion-text
            class="ux-font-lato ux-fweight-regular ux-fsize-12"
            *ngIf="this.plan?.type === planType.paid && this.plan?.frequency_type === 'years'"
            class="name_text ux-font-lato ux-fsize-14"
            >/{{ 'payment.licenses.annual' | translate }}</ion-text
          >
          <ion-text
            class="ux-font-lato ux-fweight-regular ux-fsize-12"
            *ngIf="this.plan?.type === planType.paid && this.plan?.frequency_type === 'months'"
            class="name_text ux-font-lato ux-fsize-14"
            >/{{ 'payment.licenses.monthly' | translate }}</ion-text
          >
        </div>
      </div>
      <div *ngIf="this.plan?.type === planType.premium">
        <ion-button
          class="ilc__content__button ux-fweight-bold ux-fsize-14"
          name="Contact Us"
          appTrackClick
          fill="clear"
          size="small"
          (click)="goToContactUs()"
          >{{ 'payment.licenses.contact' | translate }}</ion-button
        >
      </div>
    </div>
  </div>`,
  styleUrls: ['./item-license.component.scss'],
})
export class ItemLicenseComponent implements OnInit {
  @Input() plan: any;
  planType = PlanType;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToContactUs() {
    this.navController.navigateForward(['/payment/contact-license']).then();
  }
}
