import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { TokenOperationDataService } from 'src/app/modules/fiat-ramps/shared-ramps/services/token-operation-data/token-operation-data.service';
import { ChangeProfileTypeModalComponent } from '../change-profile-type-modal/change-profile-type-modal.component';

@Component({
  selector: 'app-simplified-wallet-subheader-buttons',
  template: ` <div class="wsb">
    <div class="wsb__card-buttons">
      <div class="wsb__card-buttons__warranty-card card">
        <app-icon-button-card
          (click)="this.goToWarrantyConstitution()"
          appTrackClick
          class="ux-font-text-lg"
          name="ux_go_to_warrant"
          [text]="'wallets.home.subheader_buttons_component.warranty_card' | translate"
          icon="ux-credit-card"
        ></app-icon-button-card>
      </div>
      <div class="wsb__card-buttons__receive-card card">
        <app-icon-button-card
          (click)="this.goToReceive()"
          appTrackClick
          class="ux-font-text-lg"
          name="ux_go_to_receive"
          [text]="'wallets.home.subheader_buttons_component.receive_card' | translate"
          icon="ux-arrow-down"
        ></app-icon-button-card>
      </div>
      <div class="wsb__card-buttons__buy-card card">
        <app-icon-button-card
          (click)="this.goToBuy()"
          appTrackClick
          class="ux-font-text-lg"
          name="ux_go_to_buy"
          [text]="'wallets.home.subheader_buttons_component.only_buy_card' | translate"
          icon="ux-currency"
        ></app-icon-button-card>
      </div>
      <div class="wsb__card-buttons__send-card card">
        <app-icon-button-card
          (click)="this.goToSend()"
          appTrackClick
          class="ux-font-text-lg"
          name="ux_go_to_send"
          [text]="'wallets.home.subheader_buttons_component.send_card' | translate"
          icon="ux-arrow-up"
        ></app-icon-button-card>
      </div>
    </div>
  </div>`,
  styleUrls: ['./simplified-wallet-subheader-buttons.component.scss'],
})
export class SimplifiedWalletSubheaderButtonsComponent {
  @Output() openWarrantyModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private tokenOperationDataService: TokenOperationDataService,
  ) {}

  goToSend() {
    this.changeProfileTypeModal();
  }

  goToReceive() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: 'USDC',
        network: 'MATIC',
      },
    };
    return this.navController.navigateForward('wallets/receive/detail', navigationExtras);
  }

  async goToBuy() {
    this.tokenOperationDataService.clean();
    this.tokenOperationDataService.set({
      asset: 'USDC',
      network: 'MATIC',
    });
    return this.navController.navigateForward('fiat-ramps/purchases');
  }

  async goToWarrantyConstitution() {
    this.openWarrantyModal.emit();
  }

  async changeProfileTypeModal() {
    const modal = await this.modalController.create({
      component: ChangeProfileTypeModalComponent,
      cssClass: 'modal',
      backdropDismiss: false,
    });
    await modal.present();
  }
}
