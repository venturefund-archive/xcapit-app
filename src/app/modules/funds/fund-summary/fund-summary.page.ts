import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';

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
        <ion-fab-button (click)="this.shareFund()">
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
                *ngIf="(this.fundStatus | currencyPercentage) > 0"
                name="arrow-round-up"
              ></ion-icon>
              <ion-icon
                *ngIf="(this.fundStatus | currencyPercentage) < 0"
                name="arrow-round-down"
              ></ion-icon>
              <ion-icon
                *ngIf="(this.fundStatus | currencyPercentage) === 0"
                name="pause"
                style="transform: rotate(90deg)"
              ></ion-icon>
              {{ (this.fundStatus | currencyPercentage) | number: '1.2-2' }}%
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
          <div class="fs__days-left" *ngIf="this.fundStatus.status">
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

        <app-fund-performance-chart *ngIf="this.fundStatus"
          [currency]="this.fundStatus?.fund.currency"
          [fundPerformance]="this.fundStatus?.status.rendimiento"
        ></app-fund-performance-chart>

        <div class="fs__no-runs">
          <p *ngIf="!this.fundStatus && !this.loadingStatus">
            {{ 'funds.fund_summary.no_runs_text' | translate }}
          </p>
        </div>
      </div>

      <ion-row>
        <ion-col>
          <ion-button
            *ngIf="this.fundStatus?.fund.estado == 'pausado'"
            type="button"
            color="success"
            expand="block"
            size="medium"
            (click)="resumeFundRuns()"
          >
            <ion-icon slot="start" name="play"></ion-icon>
            {{ 'funds.fund_summary.resume_fund_button' | translate }}
          </ion-button>
          <ion-button
            *ngIf="this.fundStatus?.fund.estado == 'active'"
            type="button"
            color="primary"
            expand="block"
            size="medium"
            (click)="pauseFundRuns()"
          >
            <ion-icon slot="start" name="pause"></ion-icon>
            {{ 'funds.fund_summary.pause_fund_button' | translate }}
          </ion-button>
        </ion-col>
        <ion-col>
          <ion-button
            *ngIf="
              this.fundStatus?.fund.estado == 'active' ||
              this.fundStatus?.fund.estado == 'pausado'
            "
            type="button"
            color="danger"
            expand="block"
            size="medium"
            (click)="finalizeFundRuns()"
          >
            <ion-icon slot="start" name="square"></ion-icon>
            {{ 'funds.fund_summary.finalize_fund_button' | translate }}
          </ion-button>
        </ion-col>
      </ion-row>

      <ion-col>
        <ion-button
          expand="block"
          size="medium"
          type="button"
          color="success"
          (click)="fundRuns(fundName)"
        >
          <ion-icon slot="start" name="list"></ion-icon>
          {{ 'funds.fund_summary.fund_runs_button' | translate }}
        </ion-button>
      </ion-col>
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
    private router: Router,
    private apiFunds: ApiFundsService,
    private subscriptionsService: SubscriptionsService
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

  shareFund() {
    this.subscriptionsService.shareSubscriptionLink(this.fundName);
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

  pauseFundRuns(): void {
    this.apiFunds.pauseFundRuns(this.fundName).subscribe(res => {
      this.getFundStatus();
    });
  }

  resumeFundRuns(): void {
    this.apiFunds.resumeFundRuns(this.fundName).subscribe(res => {
      this.getFundStatus();
    });
  }

  finalizeFundRuns(): void {
    this.apiFunds.finalizeFundRuns(this.fundName).subscribe(res => {
      this.getFundStatus();
    });
  }

  fundRuns(selectedFund: string) {
    this.router.navigate(['funds/runs', selectedFund]);
  }
}
