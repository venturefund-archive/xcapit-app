import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { RawAmount } from 'src/app/modules/wallets/shared-wallets/models/blockchain-tx/amount-of/amount-of';
import { InformationModalComponent } from 'src/app/shared/components/information-modal/information-modal.component';

@Component({
  selector: 'app-cumulative-total-yields',
  template: ` <div class="cty__content__card">
    <div class="cty__content__card__body">
      <div class="cty__content__card__body__image">
        <img class="cty__content__card__image__img" src="assets/img/defi-investments/yields.svg" alt="Yield Image" />
      </div>
      <div class="cty__content__card__information">
        <div class="cty__content__card__information__text">
          <div class="cty__content__card__information__text__title">
            <ion-text class="ux-font-header-titulo text">
              {{ 'defi_investments.defi_investment_products.total_yields' | translate }}</ion-text
            >
            <ion-icon name="information-circle" color="info" (click)="this.openInfoModal()"></ion-icon>
          </div>
          <div class="cty__content__card__information__text__amount">
            <ion-skeleton-text
              class="ux-font-titulo-xs"
              style="width:50%"
              animated
              *ngIf="!this.allLoaded"
            ></ion-skeleton-text>
            <ion-text class="ux-font-text-xl amount" *ngIf="this.allLoaded">
              {{ this.totalUsdYield.value ?? '0.00' | number: '1.2-5' }}</ion-text
            >
            <ion-text class="ux-font-header-titulo token" *ngIf="this.allLoaded">
              {{ this.totalUsdYield.token }}</ion-text
            >
          </div>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./cumulative-total-yields.component.scss'],
})
export class CumulativeTotalYieldsComponent implements OnInit {
  @Input() totalUsdYield: RawAmount;
  @Input() allLoaded: boolean;
  isInfoModalOpen = false;

  constructor(private modalController: ModalController, private translate: TranslateService) {}

  ngOnInit() {}

  async openInfoModal() {
    if (!this.isInfoModalOpen) {
      this.isInfoModalOpen = true;
      const modal = await this.modalController.create({
        component: InformationModalComponent,
        componentProps: {
          title: this.translate.instant('defi_investments.shared.earnings_modal_info.title'),
          description: this.translate.instant('defi_investments.shared.earnings_modal_info.description'),
          buttonText: this.translate.instant('defi_investments.shared.earnings_modal_info.button'),
        },
        cssClass: 'modal',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }
}
