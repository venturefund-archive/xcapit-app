import { Component, OnInit, Input } from '@angular/core';
import { FundSummaryInterface } from './fund-summary.interface';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { ApiSubscriptionsService } from 'src/app/modules/subscriptions/shared-subscriptions/services/api-subscriptions/api-subscriptions.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { Currency } from '../../enums/currency.enum';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';


@Component({
  selector: 'app-fund-summary-card',
  template: `
    <div class="fsc" (click)="this.showShareSubscriptionAlert()">
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
              {{
                this.totalBase
                  | currencyFormat
                    : {
                        currency: this.currencyBase,
                        formatUSDT: '1.2-2',
                        formatBTC: '1.2-6'
                      }
                  | hideText: this.hideFundText
              }}
            </ion-text>
            <ion-text
              class="ux-font-lato ux-fweight-regular ux-fsize-18"
              color="uxmedium"
            >
              ≈
            </ion-text>
            <ion-text
              class="ux-font-gilroy ux-fweight-regular ux-fsize-18"
              color="uxmedium"
            >
              {{
                this.totalSecond
                  | currencyFormat
                    : {
                        currency: this.currencySecond,
                        formatBTC: '1.2-7',
                        formatUSDT: '1.2-2'
                      }
                  | hideText: this.hideFundText
              }}
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
      </div>
      <div class="fsc__footer">
        <div class="fsc__footer__left">
          <!--          <div class="remaining-time-text">-->
          <!--            <ion-text-->
          <!--              class="ux-font-lato ux-fweight-regular ux-fsize-12"-->
          <!--              color="uxmedium"-->
          <!--            >-->
          <!--              {{-->
          <!--                'funds.fund_detail.fund_summary_card.remaining_time' | translate-->
          <!--              }}-->
          <!--            </ion-text>-->
          <!--          </div>-->
          <!--          <div class="remaining-time">-->
          <!--            <ion-text-->
          <!--              class="ux-font-lato ux-fweight-semibold ux-fsize-12"-->
          <!--              color="uxdark"-->
          <!--            >-->
          <!--              {{-->
          <!--                this.summary?.balance.date_info.cantidad_dias_inicio_restantes-->
          <!--              }}-->
          <!--              {{ 'funds.fund_detail.fund_summary_card.days_label' | translate }}-->
          <!--            </ion-text>-->
          <!--          </div>-->
        </div>
        <div class="fsc__footer__right">
          <div class="share-button">
            <ion-button
              appTrackClick
              name="Share"
              type="submit"
              fill="clear"
              size="small"
              [disabled]="!this.summary"
              class="ux-font-lato ux-fweight-semibold ux-fsize-14"
            >
              {{ 'funds.fund_detail.fund_summary_card.invite' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./fund-summary-card.component.scss'],
})
export class FundSummaryCardComponent implements OnInit {
  @Input() summary: FundSummaryInterface;
  hideFundText: boolean;
  @Input() fundBalance: any;
  currencyBase: string;
  currencySecond: string;
  totalBase: string;
  totalSecond: string;

  currencies = [Currency.BTC, Currency.USDT];

  constructor(
    private shareService: ShareService,
    private translate: TranslateService,
    private apiSubscriptions: ApiSubscriptionsService,
    private alertController: AlertController,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.subscribeOnHideFunds();
    this.setTotals();
    this.setCurrency();
  }

  setTotals() {
    this.totalBase = this.summary?.balance.end_balance;
    this.totalSecond = this.fundBalance?.balance.to_ca.end_balance;
  }

  setCurrency() {
    this.currencyBase = this.summary?.fund.currency;
    if (this.currencyBase === Currency.BTC) {
      this.currencySecond = Currency.USDT;
    } else {
      this.currencySecond = Currency.BTC;
    }
  }

  async showShareSubscriptionAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant(
        'funds.fund_detail.fund_summary_card.alert_header'
      ),
      message: this.translate.instant(
        'funds.fund_detail.fund_summary_card.alert_message'
      ),
      buttons: [
        {
          text: this.translate.instant(
            'funds.fund_detail.fund_summary_card.alert_exit_button'
          ),
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: this.translate.instant(
            'funds.fund_detail.fund_summary_card.alert_share_button'
          ),
          handler: (_) => this.shareSubscriptionLink(),
        },
      ],
    });
    await alert.present();
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe(
      (res) => (this.hideFundText = res)
    );
  }

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
            ),
          },
          this.translate.instant(
            'subscriptions.subscriptions_service.toast_text_copied'
          )
        );
      });
  }
}
