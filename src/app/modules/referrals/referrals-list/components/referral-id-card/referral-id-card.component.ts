import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ShareService } from '../../../../../shared/services/share/share.service';
import { ClipboardService } from '../../../../../shared/services/clipboard/clipboard.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-referral-id-card',
  template: `
      <div class="ric">
          <div class="ric__content">
              <div class="ric__content__left">
                  <div class="fund-name">
                      <ion-text
                              class="ux-font-lato ux-fweight-semibold ux-fsize-12"
                              color="uxdark"
                      >{{ 'referrals.referrals_list.referral_id_card.title' | translate }}</ion-text
                      >
                  </div>
                  <div class="actual-amount">
                      <ion-text
                              class="ux-font-gilroy ux-fweight-extrabold ux-fsize-24"
                              color="uxdark"
                      >
                          {{this.referralId}}
                      </ion-text>
                  </div>
                  <div class="actual-text">
                      <ion-text
                              class="ux-font-lato ux-fweight-regular ux-fsize-12"
                              color="uxmedium"
                      >{{
                          'referrals.referrals_list.referral_id_card.subtitle' | translate
                          }}</ion-text
                      >
                  </div>
              </div>
              <div class="ric__content__right">
                      <div class="copy-button">
                          <ion-button
                                  appTrackClick
                                  name="Copy"
                                  type="button"
                                  fill="clear"
                                  size="small"
                                  (click)="this.copyReferralId()"
                          >
                              <ion-icon slot="icon-only" name="copy-outline" color="uxdark"></ion-icon>
                          </ion-button>
                      </div>
                  <div class="share-button">
                      <ion-button
                              appTrackClick
                              name="Share"
                              type="button"
                              fill="clear"
                              size="small"
                              (click)="this.shareReferralLink()"
                      >
                          <ion-icon slot="icon-only" name="ux-share"></ion-icon>
                      </ion-button>
                  </div>
              </div>
          </div>
      </div>
  `,
  styleUrls: ['./referral-id-card.component.scss']
})
export class ReferralIdCardComponent implements OnInit {

  @Input() referralId: string;

  constructor(
    private translate: TranslateService,
    private shareService: ShareService,
    private clipboardService: ClipboardService,
    private toastService: ToastService
  ) {
  }

  ngOnInit() {
  }

  async shareReferralLink() {
    await this.shareService.share(
      {
        title: this.translate.instant('referrals.referrals_list.referral_id_card.share_title'),
        dialogTitle: this.translate.instant(
          'referrals.referrals_list.referral_id_card.share_dialogTitle'
        ),
        url: `${environment.appUrl}users/register/${this.referralId}`,
        text: this.translate.instant(
          'referrals.referrals_list.referral_id_card.share_text'
        )
      },
      this.translate.instant('referrals.referrals_list.referral_id_card.toast_text_copied')
    );
  }

  async copyReferralId() {
    await this.clipboardService.write({ string: this.referralId }).then(() => {
      this.toastService.showToast({
        message: this.translate.instant(
          'referrals.referrals_list.referral_id_card.toast_text_copied'
        ),
      });
    });
  }

}
