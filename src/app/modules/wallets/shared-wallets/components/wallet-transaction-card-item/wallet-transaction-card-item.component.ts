import { Component, Input, OnInit } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { ScanUrlOf } from '../../models/scan-url-of/scan-url-of';

@Component({
  selector: 'app-wallet-transaction-card-item',
  template: `
    <div>
      <div class="wtci">
        <div>
          <ion-img class="wtci__img" [src]="this.transaction.icon"></ion-img>
        </div>
        <div class="wtci__content">
          <div class="wtci__content__top">
            <div class="wtci__content__top__type_date_hash">
              <div class="wtci__content__top__type_date_hash__type_date">
                <ion-label class="type ux-font-lato ux-fsize-14 ux-fweight-bold">{{
                  'wallets.transactions.' + this.transaction.type | translate
                }}</ion-label>
                <ion-label class="ux-font-text-xxs date">
                  {{ this.formattedDate }}
                </ion-label>
              </div>
              <div class="wtci__content__top__type_date_hash__hash">
                <ion-text (click)="this.openTransactionUrl()" class="ux-font-text-xs">
                  {{ this.transaction.hash }}
                </ion-text>
              </div>
            </div>
            <div class="wtci__content__top__column">
              <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-semibold">
                {{ this.transaction.amount | formattedAmount }} {{ this.transaction.symbol }}
              </ion-label>
              <div class="ux-font-num-subtitulo wtci__content__top__column__badge">
                <ion-badge  [ngClass]="{'confirmed': this.transaction.successful, 'declined': !this.transaction.successful}">
                  {{ (this.transaction.successful ? 'wallets.transactions.confirmed' : 'wallets.transactions.declined' ) | translate }}</ion-badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="!this.last" class="list-divider"></div>
    </div>
  `,
  styleUrls: ['./wallet-transaction-card-item.component.scss'],
})
export class WalletTransactionCardItemComponent implements OnInit {
  @Input() transaction;
  @Input() last: boolean;
  @Input() network: string;
  formattedDate: string;
  constructor(private browserService: BrowserService, private envService : EnvService) {}

  ngOnInit() {
    this.formattedDate = this.formatDate(this.transaction.date);
    this.isBuyTransaction();
  }

  isBuyTransaction(){
    if(this.transaction.type === 'IN' && this.envService.byKey('ON_OFF_RAMPS_PROVIDER_ADDRESSES').includes(this.transaction.from) ){
      this.transaction.type = 'BUY';
      this.transaction.icon = 'assets/img/wallet-transactions/buy.svg';
    }
  }

  openTransactionUrl() {
    this.browserService.open({ url: ScanUrlOf.create(this.transaction.hash, this.network).value() });
  }

  formatDate(value) {
    return format(parseISO(value), 'dd-MM-yyyy');
  }
}
