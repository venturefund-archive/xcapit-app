import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { ApiSubscriptionsService } from '../shared-funds/services/api-subscriptions/api-subscriptions.service';

@Component({
  selector: 'app-fund-summary',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'funds.fund_summary.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="this.getSubscriptionLink()">
          <ion-icon name="share"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <div class="fs">
        <div class="fs__header">
          <h1>{{ this.fundName }}</h1>
          <ion-label class="fs__header__state">
            {{ this.fundStatus?.fund.estado }}
          </ion-label>
        </div>
        <div class="fs__content" *ngIf="this.fundStatus">
          <div class="fs__profit" *ngIf="this.fundStatus.status">
            <div class="fs__profit__main">
              <ion-icon
                *ngIf="this.fundStatus.status.profit_wcs > 0"
                name="arrow-round-up"
              ></ion-icon>
              <ion-icon
                *ngIf="this.fundStatus.status.profit_wcs < 0"
                name="arrow-round-down"
              ></ion-icon>
              <ion-icon
                *ngIf="this.fundStatus.status.profit_wcs === 0"
                name="pause"
                style="transform: rotate(90deg)"
              ></ion-icon>
              {{ this.fundStatus.status.profit_wcs | number: '1.2-2' }}%
            </div>
            <div class="fs__profit__days">
              {{
                'funds.fund_summary.profit_text'
                  | translate
                    : {
                        days: this.fundStatus.status.cantidad_dias,
                        hours: this.fundStatus.status.cantidad_horas
                      }
              }}
            </div>
          </div>
          <div
            class="fs__days-left ion-padding-top ion-margin-top"
            *ngIf="this.fundStatus.status"
          >
            <p
              *ngIf="
                this.fundStatus.status.cantidad_dias_inicio_restantes < 0;
                else hasDays
              "
            >
              {{ 'funds.fund_summary.no_days_left_text' | translate }}
            </p>
            <ng-template #hasDays>
              <p>
                {{
                  'funds.fund_summary.days_left_text'
                    | translate
                      : {
                          days: this.fundStatus.status
                            .cantidad_dias_inicio_restantes,
                          hours: this.fundStatus.status
                            .cantidad_horas_inicio_restantes
                        }
                }}
              </p>
            </ng-template>
          </div>
          <div class="fs__no-status">
            <p *ngIf="!this.fundStatus.status">
              {{ 'funds.fund_summary.no_status_text' | translate }}
            </p>
          </div>
        </div>
        <div class="fs__no-runs">
          <p *ngIf="!this.fundStatus && !this.loadingStatus">
            {{ 'funds.fund_summary.no_runs_text' | translate }}
          </p>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-summary.page.scss']
})
export class FundSummaryPage implements OnInit, OnDestroy {
  loadingStatus = true;

  fundName: string;

  fundStatus: any;

  routeParamsSubscription: Subscription;

  fundStatusSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private apiFunds: ApiFundsService,
    private apiSubscriptions: ApiSubscriptionsService,
    private shareService: ShareService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
    this.fundStatusSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.routeParamsSubscription = this.getFundName().subscribe(() =>
      this.getFundStatus()
    );
  }

  getSubscriptionLink() {
    this.apiSubscriptions
      .getSubscriptionLink(this.fundName)
      .subscribe((data: any) =>
        this.shareService.share({
          title: 'share title',
          text: 'share text',
          url: data.link })
      );
  }

  getFundStatus() {
    this.loadingStatus = true;
    this.fundStatusSubscription = this.apiFunds
      .getStatus(this.fundName)
      .subscribe(res => {
        this.fundStatus = res;
        this.loadingStatus = false;
      });
  }

  getFundName(): Observable<any> {
    return this.route.params.pipe(
      filter((params: Params) => params.fundName),
      tap((params: Params) => (this.fundName = params.fundName))
    );
  }
}
