import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-share-referral-card',
  template: `
    <div class="src ion-padding">
      <div class="src__title">
        <ion-text
          class="ux-font-lato ux-fweight-semibold ux-fsize-14"
          color="uxdark"
          >{{
            'referrals.new_referral_page.shared_referral_card.title' | translate
          }}</ion-text
        >
      </div>
      <div class="src__buttons">
        <ion-button
          appTrackClick
          name="Share Referral"
          class="ux_button"
          type="button"
          color="primary"
          expand="block"
          size="medium"
          (click)="this.shareReferralLink()"
        >
          {{
            'referrals.new_referral_page.shared_referral_card.button'
              | translate
          }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./share-referral-card.component.scss'],
})
export class ShareReferralCardComponent implements OnInit {
  @Input() referralId: string;

  constructor(
    private translate: TranslateService,
    private shareService: ShareService,
    private clipboardService: ClipboardService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  async shareReferralLink() {
    await this.shareService.share(
      {
        title: this.translate.instant(
          'referrals.referrals_list.referral_id_card.share_title'
        ),
        dialogTitle: this.translate.instant(
          'referrals.referrals_list.referral_id_card.share_dialogTitle'
        ),
        url: `${environment.appUrl}users/register/${this.referralId}`,
        text: this.translate.instant(
          'referrals.referrals_list.referral_id_card.share_text'
        ),
      },
      this.translate.instant(
        'referrals.referrals_list.referral_id_card.toast_text_copied'
      )
    );
  }
}
