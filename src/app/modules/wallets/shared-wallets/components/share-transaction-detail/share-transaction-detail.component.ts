import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-share-transaction-detail',
  template: ` <div
    appTrackClick
    [dataToTrack]="{ eventLabel: 'ux_share_transaction_details' }"
    *ngIf="this.canShare"
    [ngClass]="this.lightBackground ? 'td-light' : 'td'"
    (click)="this.shareTransactionDetail()"
  >
    <img *ngIf="!this.lightBackground" src="/assets/img/shared/share-button/share.svg" />
    <img *ngIf="this.lightBackground" src="/assets/img/shared/share-button/share-blue.svg" />
  </div>
  `,
  styleUrls: ['./share-transaction-detail.component.scss'],
})
export class ShareTransactionDetailComponent implements OnInit {
  @Input() lightBackground = false;
  @Input() txAmount : number;
  @Input() txAsset : string;
  @Input() txLink : string;
  formattedMessage : string;
  canShare: boolean;

  constructor(
    private translate: TranslateService,
    private shareService: ShareService,
    private clipboardService: ClipboardService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    this.getShareMessage();
    await this.setCanShare();
  }
  
  getShareMessage(){
    const formattedAmount = new FormattedAmountPipe().transform(this.txAmount);
    const primaryText = this.translate.instant('wallets.shared_wallets.share_transaction_detail.text');
    const secondaryText = this.translate.instant('wallets.shared_wallets.share_transaction_detail.text2');
    this.formattedMessage = `${primaryText}${formattedAmount} ${this.txAsset}. ${secondaryText} ${this.txLink}`;
  }

  async setCanShare(): Promise<void> {
    this.canShare = await this.shareService.canShare();
  }

  async shareTransactionDetail() {
    this.shareService
      .share({
        text: this.formattedMessage,
        dialogTitle: this.translate.instant('wallets.shared_wallets.share_transaction_detail.dialogTitle'),
      })
      .catch((err) => {
        if (!err.message.includes('canceled')) {
          this.clipboardService
            .write({
              string: this.formattedMessage,
            })
            .then(() => {
              this.showToast();
            });
        }
      });
  }

  private showToast() {
    this.toastService.showInfoToast({
      message: this.translate.instant('wallets.shared_wallets.share_transaction_detail.share_error'),
    });
  }

}
