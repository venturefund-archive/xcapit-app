import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';
import { Transfer } from '../../models/transfer/transfer.interface';

@Component({
  selector: 'app-wallet-transaction-card',
  template: `
    <div class="wtc">
      <ion-list class="wtc__list ">
        <app-wallet-transaction-card-item
          *ngFor="let transfer of this.firstTransfers; let last = last"
          [transfer]="transfer"
          [network]="this.network"
          [last]="last"
        ></app-wallet-transaction-card-item>
        <div *ngIf="this.openedAccordion" class="list-divider"></div>
        <ion-accordion-group>
          <ion-accordion toggleIcon="" class="wtc__accordeon__list__accordion" value="transfers">
            <div slot="content" class="wtc__accordeon__list__container">
              <app-wallet-transaction-card-item
                *ngFor="let transfer of this.remainingTransfers; let last = last"
                [transfer]="transfer"
                [network]="this.network"
                [last]="last"
              ></app-wallet-transaction-card-item>
            </div>
          </ion-accordion>
        </ion-accordion-group>
        <div class="wtc__button" *ngIf="this.transfers.length >= 4">
          <ion-button
            *ngIf="!this.openedAccordion"
            name="Open Accordion"
            class="link ux-link-xs"
            appTrackClick
            fill="clear"
            size="small"
            (click)="openAccordion()"
          >
            {{'wallets.shared_wallets.wallet_transaction_card.expand_button' | translate }}
          </ion-button>
          <ion-button
            *ngIf="this.openedAccordion"
            name="Close Accordion"
            class="link ux-link-xs"
            appTrackClick
            fill="clear"
            size="small"
            (click)="closeAccordion()"
          >
            {{ 'wallets.shared_wallets.wallet_transaction_card.reduce_button' | translate }}
          </ion-button>
        </div>
      </ion-list>
    </div>
  `,
  styleUrls: ['./wallet-transaction-card.component.scss'],
})
export class WalletTransactionCardComponent implements OnInit {
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  @Input() transfers: Transfer[];
  @Input() network: string;
  firstTransfers: Transfer[];
  remainingTransfers: Transfer[];
  openedAccordion: boolean;
  constructor() {}

  ngOnInit() {
    this.accordionGroup.value = '';
    this.separateTransfers();
  }

  separateTransfers(){
    this.firstTransfers = this.transfers?.slice(0, 3);
    this.remainingTransfers = this.transfers?.slice(3, this.transfers.length);
  }

  openAccordion() {
    this.accordionGroup.value = 'transfers';
    this.openedAccordion = true;
  }

  closeAccordion() {
    this.accordionGroup.value = undefined;
    this.openedAccordion = false;
  }
}
