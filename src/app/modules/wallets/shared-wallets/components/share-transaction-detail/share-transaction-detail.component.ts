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
  canShare: boolean;
  constructor(
    private translate: TranslateService,
    private shareService: ShareService,
    private clipboardService: ClipboardService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    await this.setCanShare();
  }

  async setCanShare(): Promise<void> {
    this.canShare = await this.shareService.canShare();
  }

  async shareTransactionDetail() {
    const formattedAmount = new FormattedAmountPipe().transform(this.txAmount);
    const formattedText = `${this.translate.instant('wallets.shared_wallets.share_transaction_detail.text')}${formattedAmount} ${this.txAsset}. ${this.translate.instant('wallets.shared_wallets.share_transaction_detail.text2')} ${this.txLink}`;
    this.shareService
      .share({
        text: formattedText,
        dialogTitle: this.translate.instant('wallets.shared_wallets.share_transaction_detail.dialogTitle'),
      })
      .catch((err) => {
        if (!err.message.includes('canceled')) {
          this.clipboardService
            .write({
              string: formattedText,
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
