import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { Quotes } from '../../interfaces/quotes.interface';
import { QuotesService } from '../../services/quotes.service';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Observable } from 'rxjs';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';

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
                  <app-ux-loading-block minSize="30px"></app-ux-loading-block>
                </div>
                <div class="container">
                  <app-item-quote
                    *ngFor="let quote of this.firstQuotes; let last = last"
                    [quotation]="quote"
                  ></app-item-quote>
                </div>
                <ion-accordion-group>
                  <ion-accordion toggleIcon="" class="accordion" value="quotes">
                    <div slot="content" class="container">
                      <app-item-quote
                        *ngFor="let quote of this.remainingQuotes; let last = last"
                        [quotation]="quote"
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
  openedAccordion: boolean;
  walletExist: boolean;
  completeData;
  filteredData: Quotes[];
  coins: Coin[];
  waitingQuotes = true;
  firstQuotes: Quotes[];
  remainingQuotes: Quotes[];
  usdcData;

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
    this.getUsdcQuote();
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
    this.storageService.getAssetsSelected().then((coins) => {
      const userCoins = coins;
      const filteredData = this.completeData?.filter((filteredCoin) => {
        for (const i in userCoins) {
          if (filteredCoin.symbol === userCoins[i].symbol) {
            return filteredCoin;
          }
        }
      });
      this.separateFilteredData(filteredData);
    });
  }

  async separateFilteredData(allQuotes: Quotes[]) {
    const alreadySettedQuotes = await this.setUsdcPrice(allQuotes);
    this.firstQuotes = alreadySettedQuotes?.slice(0, 3);
    this.remainingQuotes = alreadySettedQuotes?.slice(3, allQuotes.length);
    this.waitingQuotes = false;
  }

  async getUsdcQuote(){
    await this.quotesService.getUsdcQuote().subscribe((data) => {
      this.usdcData = data;
    })
  }

  async setUsdcPrice(allQuotes : Quotes[]){
    const usdcQuote = allQuotes.find((quote) => quote.symbol === 'USDCUSDT');
    if(usdcQuote){
      if(this.usdcData !== undefined){
        usdcQuote.lastPrice = this.usdcData.market_data.current_price.usd;
        usdcQuote.priceChangePercent = this.usdcData.market_data.price_change_percentage_24h_in_currency.usd;
      }else{
        const index = allQuotes.indexOf(usdcQuote);
        allQuotes.splice(index, 1);
      }
    }
    return allQuotes;
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
