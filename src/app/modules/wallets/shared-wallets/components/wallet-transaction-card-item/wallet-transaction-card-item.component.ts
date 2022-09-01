import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { TransactionDetailsService } from '../../services/transaction-details/transaction-details.service';
import { JSONTransfer } from '../../models/json-transfer/json-transfer';
import { Transfer } from '../../models/transfer/transfer.interface';
import { EnvService } from 'src/app/shared/services/env/env.service';

@Component({
  selector: 'app-wallet-transaction-card-item',
  template: `
    <div>
      <div class="wtci">
        <div>
          <ion-img class="wtci__img" [src]="this.tplTransfer.icon"></ion-img>
        </div>
        <div class="wtci__content">
          <div class="wtci__content__top">
            <div class="wtci__content__top__type_date_hash">
              <div class="wtci__content__top__type_date_hash__type_date">
                <ion-label class="type ux-font-lato ux-fsize-14 ux-fweight-bold">{{
                  'wallets.transactions.' + this.tplTransfer.type | translate
                }}</ion-label>
                <ion-label class="ux-font-text-xxs date">
                  {{ this.formattedDate }}
                </ion-label>
              </div>
              <div class="wtci__content__top__type_date_hash__hash">
                <ion-text (click)="this.openTransactionDetails()" class="ux-font-text-xs">
                  {{ this.tplTransfer.tx_hash }}
                </ion-text>
              </div>
            </div>
            <div class="wtci__content__top__column">
              <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-semibold">
                {{ this.tplTransfer.amount | formattedAmount }} {{ this.tplTransfer.token.value }}
              </ion-label>
              <div class="ux-font-num-subtitulo wtci__content__top__column__badge">
                <ion-badge
                  [ngClass]="{ confirmed: this.tplTransfer.successful, declined: !this.tplTransfer.successful }"
                >
                  {{
                    (this.tplTransfer.successful ? 'wallets.transactions.confirmed' : 'wallets.transactions.declined')
                      | translate
                  }}</ion-badge
                >
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
  @Input() transfer: Transfer;
  @Input() last: boolean;
  @Input() network: string;
  formattedDate: string;
  tplTransfer: any;

  constructor(
    private navController: NavController,
    private transactionDetailsService: TransactionDetailsService,
    private envService: EnvService
  ) {}

  ngOnInit() {
    this.tplTransfer = new JSONTransfer(this.transfer).value();
    this.formattedDate = this.formatDate(this.tplTransfer.block_signed_at);
    this.isBuyTransaction();
  }

  isBuyTransaction() {
    if (
      this.tplTransfer.type === 'IN' &&
      this.envService.byKey('ON_OFF_RAMPS_PROVIDER_ADDRESSES').includes(this.tplTransfer.from)
    ) {
      this.tplTransfer.type = 'BUY';
      this.tplTransfer.icon = 'assets/img/wallet-transactions/buy.svg';
    }
  }

  openTransactionDetails() {
    this.saveTransactionDetails();
    this.navController.navigateForward(['/wallets/transaction-details']);
  }

  formatDate(value) {
    return format(parseISO(value), 'dd-MM-yyyy');
  }

  private saveTransactionDetails() {
    this.transactionDetailsService.transactionData = this.transfer;
  }
}
