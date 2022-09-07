import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CachedAssetFactory } from 'src/app/shared/models/asset/cached-asset/factory/cached-asset-factory';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-share-test',
  template: ` <div
    appTrackClick
    [dataToTrack]="{ eventLabel: 'ux_share_transaction_details' }"
    
    [ngClass]="this.lightBackground ? 'se-light' : 'se'"
    (click)="this.share()"
  >
    <img *ngIf="!this.lightBackground" src="/assets/img/financial-education/shared-financial-education/share.svg" />
    <img *ngIf="this.lightBackground" src="/assets/img/financial-education/shared-financial-education/share-blue.svg" />
  </div>
  `,
  styleUrls: ['./share-test.component.scss'],
})
export class ShareTestComponent implements OnInit {
  @Input() lightBackground = false;
  @Input() txAmount : number = 5;
  @Input() txAsset : string = 'MATIC';
  @Input() txLink : string = 'wwww.google.com';
  
  asset: string;
  canShare: boolean;
  constructor(
    private platformService: PlatformService,
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

  async share() {
    this.shareService
      .share({
        title: this.translate.instant('financial_education.shared.share_send_transaction.title'),
        text: `${this.translate.instant('financial_education.shared.share_send_transaction.text')} ${this.txAmount} ${this.txAsset} ${this.translate.instant('financial_education.shared.share_send_transaction.text2')} ${this.txLink}`,
        dialogTitle: this.translate.instant('financial_education.shared.share_send_transaction.dialogTitle'),
      })
      .catch((err) => {
        if (!err.message.includes('canceled')) {
          this.clipboardService
            .write({
              string: `${this.translate.instant(
                'financial_education.shared.share_send_transaction.text'
              )} ${this.storeLink()}`,
            })
            .then(() => {
              this.showToast();
            });
        }
      });
  }

  private showToast() {
    this.toastService.showInfoToast({
      message: this.translate.instant('financial_education.shared.share_send_transaction.share_error'),
    });
  }

  storeLink() {
    return this.platformService.platform() === 'android'
      ? 'https://play.google.com/store/apps/details?id=com.xcapit.app'
      : 'https://apps.apple.com/ar/app/xcapit/id1545648148';
  }
}
