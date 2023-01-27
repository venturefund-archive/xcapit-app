import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-network-selector-modal',
  template: `
    <ion-content class="nsm__content ion-padding-start ion-padding-end ion-padding-bottom">
      <div class="nsm__header">
        <ion-text class="ion-padding-start nsm__header__text ux-font-text-lg">
          {{ 'contacts.shared_contacts.network_selector_modal.title' | translate }}
        </ion-text>
        <ion-button
          appTrackClick
          name="Close"
          (click)="this.close()"
          fill="clear"
          size="small"
          color="neutral80"
          class="nsm__header__close"
        >
          <ion-icon name="close"></ion-icon>
        </ion-button>
      </div>
      <ion-item lines="none" *ngFor="let network of this.networks" class="last ux-font-text-xs">
        <div class="nsm__network">
          <ion-label>
            {{ this.network.name | translate }}
          </ion-label>
          <ion-label>
            {{ this.network.value | translate }}
          </ion-label>
        </div>
        <ion-checkbox
          [disabled]="network.disabled"
          [checked]="network.checked"
          [value]="network.value"
          (ionChange)="this.networkSelected($event, network.value)"
          mode="md"
          slot="start"
          name="checkbox-condition"
        ></ion-checkbox>
      </ion-item>
    </ion-content>
  `,
  styleUrls: ['./network-selector-modal.component.scss'],
})
export class NetworkSelectorModalComponent implements OnInit {
  selectedNetworks = [];
  networks = [];
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.preselectedNetworks();
  }

  preselectedNetworks() {
    this.selectedNetworks = this.networks.filter((n) => n.checked).map((n) => n.value);
    if (this.selectedNetworks) {
      this.disableCheckboxesOnInit();
    }
  }

  close() {
    this.modalController.dismiss(this.selectedNetworks);
  }

  networkSelected(event, value) {
    if (this.checked(event)) {
      if (!this.includes(value)) {
        this.selectedNetworks.push(value);
      }
    } else {
      const index = this.selectedNetworks.indexOf(value);
      this.selectedNetworks.splice(index, 1);
    }
    this.disableProperlyCheckboxes(event, value);
  }

  disableProperlyCheckboxes(event, value) {
    if (value === 'SOLANA') {
      this.disableNotSolanaNetworks(this.checked(event));
    } else {
      if (this.selectedNetworks.length === 0) {
        this.enableAllNetworks();
      } else {
        this.disableSolanaNetwork();
      }
    }
  }

  disableCheckboxesOnInit() {
    for (const selectedNetwork of this.selectedNetworks) {
      if (selectedNetwork === 'SOLANA') {
        this.disableNotSolanaNetworks(true);
      } else {
        this.disableSolanaNetwork();
      }
    }
  }

  disableSolanaNetwork() {
    const index = this.networks.findIndex((n) => n.value === 'SOLANA');
    this.networks[index].disabled = true;
  }

  enableAllNetworks() {
    for (const network of this.networks) {
      network.disabled = false;
    }
  }

  disableNotSolanaNetworks(value: boolean) {
    for (const network of this.networks) {
      if (network.value !== 'SOLANA') {
        network.disabled = value;
      }
    }
  }

  checked(event) {
    return event.detail.checked;
  }

  includes(value) {
    return this.selectedNetworks.includes(value);
  }
}
