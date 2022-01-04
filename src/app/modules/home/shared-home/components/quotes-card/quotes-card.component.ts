import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { Quotes } from '../../interfaces/quotes.interface';
import { QuotesService } from '../../services/quotes.service';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quotes-card',
  template: `
    <div class="qc">
      <div class="qc__content">
        <div class="qc__accordeon">
          <ion-item lines="none" slot="header">
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
                <div class="loader" *ngIf="this.waitingQuotes">
                  <app-ux-loading-block minSize="22px"></app-ux-loading-block>
                </div>
                <div class="container">
                  <app-item-quote
                    *ngFor="let quote of this.firstQuotes; let last = last"
                    [quote]="quote"
                  ></app-item-quote>
                </div>
                <ion-accordion-group>
                  <ion-accordion toggleIcon="" class="accordion" value="quotes">
                    <div slot="content" class="container">
                      <app-item-quote
                        *ngFor="let quote of this.remainingQuotes; let last = last"
                        [quote]="quote"
                        [last]="last"
                      ></app-item-quote>
                    </div>
                  </ion-accordion>
                </ion-accordion-group>
              </ion-list>
            </app-ux-list-inverted>
          </ion-list>
        </div>
      </div>
      <div class="qc__button">
        <ion-button
          *ngIf="!this.openedAccordion"
          name="Open Accordion"
          class="link ux-link-xs"
          appTrackClick
          fill="clear"
          size="small"
          (click)="openAccordion()"
        >
          {{ 'home.home_page.quotes_card.more_button' | translate }}
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
          {{ 'home.home_page.quotes_card.less_button' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./quotes-card.component.scss'],
})
export class QuotesCardComponent implements OnInit {
  @Input() update: Observable<void>;
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  openedAccordion;
  walletExist: boolean;
  completeData;
  filteredData: Quotes[];
  coins;
  waitingQuotes = true;
  firstQuotes: Quotes[];
  remainingQuotes: Quotes[];

  constructor(
    private quotesService: QuotesService,
    private walletService: WalletService,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService
  ) {}

  ngOnInit() {
    this.accordionGroup.value = '';
    this.getAllQuotes();
    this.getCoins();
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
      const filteredData = this.completeData?.filter((filteredCoin) => {
        for (const i in userCoins) {
          if (filteredCoin.symbol === userCoins[i].symbol) {
            return filteredCoin;
          }
        }
      });
      this.separateFilteredData(filteredData);
      this.waitingQuotes = false;
    });
  }

  separateFilteredData(allQuotes: Quotes[]) {
    this.firstQuotes = allQuotes?.slice(0, 3);
    this.remainingQuotes = allQuotes?.slice(3, allQuotes.length);
  }

  getCoins() {
    this.coins = this.apiWalletService.getCoins();
  }

  getNativeQuotes() {
    const filteredNativeCoins = this.coins?.filter((coin) => coin.native === true);
    const filteredData = this.completeData?.filter((filteredCoin) => {
      for (const i in filteredNativeCoins) {
        if (filteredCoin.symbol === filteredNativeCoins[i].symbol) {
          return filteredCoin;
        }
      }
    });
    this.separateFilteredData(filteredData);
    this.waitingQuotes = false;
  }

  getAllQuotes() {
    this.quotesService.getAllQuotes().subscribe({
      next: (res) => {
        this.completeData = res;
      },
      complete: () => {
        this.existWallet();
      },
    });
  }

  openAccordion() {
    this.accordionGroup.value = 'quotes';
    this.openedAccordion = true;
  }

  closeAccordion() {
    this.accordionGroup.value = undefined;
    this.openedAccordion = false;
  }
}
