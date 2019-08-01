import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiRunsService } from '../shared-runs/services/api-runs/api-runs.service';
import { LogsService } from 'src/app/shared/services/logs/logs.service';

@Component({
  selector: 'app-run-summary',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'runs.run_summary.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <div class="fs">
        <div class="fs__header">
          <h1>
            {{ 'runs.run_summary.run_title' | translate }}
            {{ this.runStatus?.fund?.id_corrida
            }}{{ 'runs.run_summary.fund_title' | translate }}
            {{ this.runStatus?.fund?.nombre_bot }}
          </h1>
          <ion-label class="fs__header__state">
            {{ this.runStatus?.fund.estado }}
          </ion-label>
        </div>
        <div class="fs__content" *ngIf="this.runStatus">
          <div class="fs__profit" *ngIf="this.runStatus.status">
            <div class="fs__profit__main">
              <ion-icon
                *ngIf="(this.runStatus | currencyPercentage) > 0"
                name="arrow-round-up"
              ></ion-icon>
              <ion-icon
                *ngIf="(this.runStatus | currencyPercentage) < 0"
                name="arrow-round-down"
              ></ion-icon>
              <ion-icon
                *ngIf="(this.runStatus | currencyPercentage) === 0"
                name="pause"
                style="transform: rotate(90deg)"
              ></ion-icon>
              {{ this.runStatus | currencyPercentage | number: '1.2-2' }}%
            </div>
            <div class="fs__profit__days">
              {{
                'runs.run_summary.profit_text'
                  | translate
                    : {
                        days: this.runStatus.status.cantidad_dias,
                        hours: this.runStatus.status.cantidad_horas
                      }
              }}
            </div>
          </div>
          <div class="fs__no-status">
            <p *ngIf="!this.runStatus.status">
              {{ 'runs.run_summary.no_status_text' | translate }}
            </p>
          </div>
        </div>

        <app-run-performance-chart
          *ngIf="this.runStatus"
          [currency]="this.runStatus?.fund?.currency"
          [runPerformance]="this.runStatus?.status?.rendimiento"
        ></app-run-performance-chart>

        <div class="fs__no-runs">
          <p *ngIf="!this.runStatus && !this.loadingStatus">
            {{ 'runs.run_summary.no_runs_text' | translate }}
          </p>
        </div>
      </div>

      <div class="ion-padding-top" *ngIf="false">
        <ion-button
          margin-top
          expand="block"
          size="medium"
          type="button"
          color="tertiary"
          routerDirection="forward"
          [routerLink]="['/funds/fund-balance', this.pk]"
          [disabled]="!this.runStatus?.status"
        >
          {{ 'runs.run_summary.fund_balance_button' | translate }}
        </ion-button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./run-summary.page.scss']
})
export class RunSummaryPage implements OnInit, OnDestroy {
  pk: string;
  runStatusSubscription: Subscription;
  loadingStatus = true;
  runStatus: any;

  constructor(
    private apiRuns: ApiRunsService,
    private route: ActivatedRoute,
    private logsService: LogsService
  ) {}

  ngOnInit() {}
  ionViewDidEnter() {
    this.logsService
      .log(`{"message": "Has entered run-summary run: ${this.pk}"}`)
      .subscribe();
  }

  ionViewWillEnter() {
    this.pk = this.route.snapshot.paramMap.get('pk');
    this.getRunStatus();
  }

  ngOnDestroy() {
    this.runStatusSubscription.unsubscribe();
  }

  getRunStatus() {
    this.loadingStatus = true;
    this.runStatusSubscription = this.apiRuns
      .getStatus(this.pk)
      .subscribe(res => {
        this.logsService
          .log(`{"message": "Has requested run status. run: ${this.pk}"}`)
          .subscribe();
        this.runStatus = res;
        this.loadingStatus = false;
      });
  }
}
