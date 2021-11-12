import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShareService } from '../../../../../shared/services/share/share.service';
import { ClipboardService } from '../../../../../shared/services/clipboard/clipboard.service';
import { PlatformService } from '../../../../../shared/services/platform/platform.service';

@Component({
  selector: 'app-referrals-share',
  template: `
    <div class="rs ux-card ion-padding">
      <div class="rs__img">
        <img src="assets/img/referrals/referrals-summary/referrals-gift.svg" alt="Referral Share Gift" />
      </div>

      <div class="rs__title">
        <ion-text class="ux-font-text-xl">{{ 'referrals.referrals_share.title' | translate }}</ion-text>
      </div>

      <div class="rs__first-order">
        <ion-text class="ux-font-header-titulo"
          >{{ 'referrals.referrals_share.first_order_referrals_title' | translate }}
        </ion-text>
        <br />
        <ion-text class="ux-font-text-base">
          {{ 'referrals.referrals_share.first_order_referrals_text' | translate: { amount: this.firstOrderReward } }}
        </ion-text>
      </div>

      <div class="rs__second-order">
        <ion-text class="ux-font-header-titulo">
          {{ 'referrals.referrals_share.second_order_referrals_title' | translate }}</ion-text
        >
        <br />
        <ion-text class="ux-font-text-base">
          {{ 'referrals.referrals_share.second_order_referrals_text' | translate: { amount: this.secondOrderReward } }}
        </ion-text>
      </div>

      <div class="rs__buttons">
        <ion-button
          *ngIf="this.isNative"
          class="ux_button ux-font-button"
          color="uxsecondary"
          (click)="this.share()"
          appTrackClick
          name="Share"
          >{{ 'referrals.referrals_share.share' | translate }}
        </ion-button>
        <ion-button
          class="ux_button ux-font-button"
          color="uxsecondary"
          (click)="this.copy()"
          appTrackClick
          name="Copy"
          >{{
            (this.wasCopied ? 'referrals.referrals_share.copied' : 'referrals.referrals_share.copy') | translate
          }}</ion-button
        >
      </div>

      <div class="rs__tos">
        <a>{{ 'referrals.referrals_share.tos' | translate }}</a>
      </div>
    </div>
  `,
  styleUrls: ['./referrals-share.component.scss'],
})
export class ReferralsShareComponent implements OnInit {
  @Input() firstOrderReward: number;
  @Input() secondOrderReward: number;
  @Input() link: string;
  @Output() copied: EventEmitter<void> = new EventEmitter<void>();
  @Output() shared: EventEmitter<void> = new EventEmitter<void>();
  wasCopied = false;
  isNative = false;

  constructor(
    private shareService: ShareService,
    private clipboardService: ClipboardService,
    private platformService: PlatformService
  ) {}

  ngOnInit() {
    this.isNative = this.platformService.isNative();
  }

  share() {
    this.shareService.share({ url: this.link }, '').then(() => this.shared.emit());
  }

  copy() {
    this.clipboardService.write({ string: this.link, url: this.link }).then(() => {
      this.wasCopied = true;
      this.copied.emit();
    });
  }
}
