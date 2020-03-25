import { Component, OnInit, Input } from '@angular/core';
import { FundSummaryInterface } from './fund-summary.interface';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { ApiSubscriptionsService } from 'src/app/modules/subscriptions/shared-subscriptions/services/api-subscriptions/api-subscriptions.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-fund-summary-card',
  template: `
    <div class="fsc">
      <div class="fsc__content">
        <div class="fsc__content__left">
          <div class="fund-name">
            <ion-text
              class="ux-font-lato ux-fweight-semibold ux-fsize-12"
              color="uxdark"
              >{{ this.summary?.fund.nombre_bot }}</ion-text
            >
          </div>
          <div class="actual-amount">
            <ion-text
              class="ux-font-gilroy ux-fweight-extrabold ux-fsize-24"
              color="uxdark"
            >
              {{ this.summary?.balance.balance_fin | number: '1.2-2' }}
              {{ this.summary?.fund.currency }}
            </ion-text>
          </div>
          <div class="actual-text">
            <ion-text
              class="ux-font-lato ux-fweight-regular ux-fsize-12"
              color="uxmedium"
              >{{
                'funds.fund_detail.fund_summary_card.actual_amount' | translate
              }}</ion-text
            >
          </div>
        </div>
        <div class="fsc__content__right">
          <div class="initial-amount">
            <ion-text
              class="ux-font-gilroy ux-fweight-extrabold ux-fsize-24"
              color="uxdark"
            >
              {{ this.summary?.balance.balance_inicio | number: '1.2-2' }}
              {{ this.summary?.fund.currency }}
            </ion-text>
          </div>
          <div class="initial-text">
            <ion-text
              class="ux-font-lato ux-fweight-regular ux-fsize-12"
              color="uxmedium"
            >
              {{
                'funds.fund_detail.fund_summary_card.initial_amount' | translate
              }}
            </ion-text>
          </div>
        </div>
      </div>
      <div class="fsc__footer">
        <div class="fsc__footer__left">
          <div class="remaining-time-text">
            <ion-text
              class="ux-font-lato ux-fweight-regular ux-fsize-12"
              color="uxmedium"
            >
              {{
                'funds.fund_detail.fund_summary_card.remaining_time' | translate
              }}
            </ion-text>
          </div>
          <div class="remaining-time">
            <ion-text
              class="ux-font-lato ux-fweight-semibold ux-fsize-12"
              color="uxdark"
            >
              {{
                this.summary?.balance.date_info.cantidad_dias_inicio_restantes
              }}
              {{ 'funds.fund_detail.fund_summary_card.days_label' | translate }}
            </ion-text>
          </div>
        </div>
        <div class="fsc__footer__right">
          <div class="share-button">
            <ion-button
              appTrackClick
              name="Share"
              type="submit"
              fill="clear"
              size="small"
              (click)="this.shareSubscriptionLink()"
              [disabled]="!this.summary"
            >
              <ion-icon slot="icon-only" name="ux-share"></ion-icon>
            </ion-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./fund-summary-card.component.scss']
})
export class FundSummaryCardComponent implements OnInit {
  @Input() summary: FundSummaryInterface;
  constructor(
    private shareService: ShareService,
    private translate: TranslateService,
    private apiSubscriptions: ApiSubscriptionsService
  ) {}

  ngOnInit() {}

  shareSubscriptionLink() {
    this.apiSubscriptions
      .getSubscriptionLink(this.summary.fund.nombre_bot)
      .subscribe((data: any) => {
        this.shareService.share(
          {
            title: this.translate.instant(
              'subscriptions.subscriptions_service.share_title'
            ),
            text: this.translate.instant(
              'subscriptions.subscriptions_service.share_text'
            ),
            url: data.link,
            dialogTitle: this.translate.instant(
              'subscriptions.subscriptions_service.share_title'
            )
          },
          this.translate.instant(
            'subscriptions.subscriptions_service.toast_text_copied'
          )
        );
      });
  }
}
