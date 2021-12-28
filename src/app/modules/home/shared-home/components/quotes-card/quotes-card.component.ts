import { Component, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { Quotes } from '../../interfaces/quotes.interface';
import { QuotesService } from '../../services/quotes.service';
import { NONPROD_COINS } from '../../../../wallets/shared-wallets/constants/coins.nonprod';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';

@Component({
  selector: 'app-quotes-card',
  template: `
    <div class="qc">
      <div class="qc__content">
        <ion-accordion-group class="qc__accordeon">
          <ion-accordion toggleIcon="" value="quotes">
            <ion-item class="qc__header" slot="header">
              <ion-label>{{ 'home.home_page.quotes_card.title' | translate }}</ion-label>
            </ion-item>
            <ion-list show="true" slot="content">
              <app-ux-list-inverted>
                <ion-list>
                  <ion-item class="table-header ux-font-text-xxs">
                    <ion-label>
                      {{ 'home.home_page.quotes_card.table_label1' | translate }}
                    </ion-label>
                    <ion-label>
                      {{ 'home.home_page.quotes_card.table_label2' | translate }}
                    </ion-label>
                    <ion-label class="right">
                      {{ 'home.home_page.quotes_card.table_label3' | translate }}
                    </ion-label>
                  </ion-item>
                  <div class="container" *ngFor="let qu of this.filteredData; let last = last">
                    <ion-item class="table-header ">
                      <ion-text class="ux-font-text-xs"> {{ qu.symbol }} </ion-text>
                      <ion-text class="ux-font-titulo-xs">
                        {{ qu.lastPrice | currency }}
                      </ion-text>
                      <ion-text class="ux-font-text-xs positive" *ngIf="this.qu.priceChangePercent >= 0">
                        +{{ this.qu.priceChangePercent | number: '1.0-2' }}%
                      </ion-text>
                      <ion-text
                        class="ux-font-text-xs regular extrasmall negative"
                        *ngIf="this.qu.priceChangePercent < 0"
                      >
                        {{ this.qu.priceChangePercent | number: '1.0-2' }}%
                      </ion-text>
                    </ion-item>
                    <div class="list-divider" *ngIf="!last"></div>
                  </div>
                </ion-list>
              </app-ux-list-inverted>
            </ion-list>
          </ion-accordion>
        </ion-accordion-group>
      </div>
      <div class="qc__button">
        <ion-button
          *ngIf="!this.openedAccordeon"
          name="Go To Help"
          class="link ux-link-xs"
          appTrackClick
          fill="clear"
          size="small"
          (click)="openAccordeon()"
        >
          {{ 'Ver más' | translate }}
        </ion-button>
        <ion-button
          *ngIf="this.openedAccordeon"
          name="Go To Help"
          class="link ux-link-xs"
          appTrackClick
          fill="clear"
          size="small"
          (click)="closeAccordeon()"
        >
          {{ 'Ver menos' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./quotes-card.component.scss'],
})
export class QuotesCardComponent implements OnInit {
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  openedAccordeon;
  walletExist: boolean;
  completeData;
  filteredData: Quotes;
  constructor(
    private quotesService: QuotesService,
    private walletService: WalletService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.accordionGroup.value = '';
    this.getPrices();
  }

  existWallet() {
    this.walletService.walletExist().then((res) => {
      this.walletExist = res;
      if (this.walletExist) {
        this.getUserCoinsQuotes();
      } else {
        this.getNativeQuotes();
      }
    });
  }

  getUserCoinsQuotes() {
    this.storageService.getAssestsSelected().then((coins) => {
      const userCoins = coins;
      this.filteredData = this.completeData.filter((filteredCoin) => {
        for (const i in userCoins) {
          if (filteredCoin.symbol === userCoins[i].symbol) {
            return filteredCoin;
          }
        }
      });
    });
  }

  getNativeQuotes() {
    const filteredNativeCoins = NONPROD_COINS.filter((coin) => coin.native === true);
    this.filteredData = this.completeData.filter((filteredCoin) => {
      for (const i in filteredNativeCoins) {
        if (filteredCoin.symbol === filteredNativeCoins[i].symbol) {
          return filteredCoin;
        }
      }
    });
  }

  getPrices() {
    this.quotesService.getPrice().subscribe({
      next: (res) => {
        this.completeData = res;
      },
      complete: () => {
        this.existWallet();
      },
    });
  }

  openAccordeon() {
    this.accordionGroup.value = 'quotes';
    this.openedAccordeon = true;
  }

  closeAccordeon() {
    this.accordionGroup.value = undefined;
    this.openedAccordeon = false;
  }
}
