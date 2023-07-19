import { Component, Input, OnInit } from '@angular/core';
import { DefaultPlatformService } from 'src/app/shared/services/platform/default/default-platform.service';
import { TranslateService } from '@ngx-translate/core';
import { ShareService } from '../../../../../shared/services/share/share.service';
import { CachedAssetFactory } from 'src/app/shared/models/asset/cached-asset/factory/cached-asset-factory';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-share-education',
  template: `
    <div
      appTrackClick
      [dataToTrack]="{ eventLabel: 'ux_education_share' }"
      *ngIf="this.canShare"
      [ngClass]="this.lightBackground ? 'se-light' : 'se'"
      (click)="this.share()"
    >
      <img *ngIf="!this.lightBackground" src="/assets/img/shared/share-button/share.svg" />
      <img
        *ngIf="this.lightBackground"
        src="/assets/img/shared/share-button/share-blue.svg"
      />
    </div>
  `,
  styleUrls: ['./share-education.component.scss'],
})
export class ShareEducationComponent implements OnInit {
  @Input() lightBackground = false;
  asset: string;
  canShare: boolean;
  constructor(
    private platformService: DefaultPlatformService,
    private translate: TranslateService,
    private shareService: ShareService,
    private cachedAsset: CachedAssetFactory,
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
    const cachedAsset = await this.cachedAsset
      .new('/assets/img/financial-education/shared-financial-education/share-image.jpg')
      .value();

    this.shareService
      .share({
        title: this.translate.instant('financial_education.shared.share_education.title'),
        text: `${this.translate.instant('financial_education.shared.share_education.text')} ${this.storeLink()}`,
        url: cachedAsset.uri,
        dialogTitle: this.translate.instant('financial_education.shared.share_education.dialogTitle'),
      })
      .catch((err) => {
        if (!err.message.includes('canceled')) {
          this.clipboardService
            .write({
              string: `${this.translate.instant(
                'financial_education.shared.share_education.text'
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
      message: this.translate.instant('financial_education.shared.share_education.share_error'),
    });
  }

  storeLink() {
    return this.platformService.platform() === 'android'
      ? 'https://play.google.com/store/apps/details?id=com.xcapit.app'
      : 'https://apps.apple.com/ar/app/xcapit/id1545648148';
  }
}
