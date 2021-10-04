import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiRunsService } from '../shared-runs/services/api-runs/api-runs.service';

@Component({
  selector: 'app-run-summary',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'runs.run_summary.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="fs">
        <div class="fs__header">
          <h1>
            {{ 'runs.run_summary.run_title' | translate }}
            {{ this.runStatus?.fund?.id_corrida }}{{ 'runs.run_summary.fund_title' | translate }}
            {{ this.runStatus?.fund?.nombre_bot }}
          </h1>
          <ion-label class="ux-font-num-subtitulo fs__header__state">
            {{ this.runStatus?.fund.estado }}
          </ion-label>
        </div>
        <div class="fs__content" *ngIf="this.runStatus">
          <div class="fs__profit" *ngIf="this.runStatus.status">
            <div class="fs__profit__main">
              <app-percentage-display [percentage]="this.runStatus.status.porcentaje"></app-percentage-display>
            </div>
            <div class="fs__profit__days">
              {{
                'runs.run_summary.profit_text'
                  | translate
                    : {
                        days: this.runStatus.status.date_info.cantidad_dias,
                        hours: this.runStatus.status.date_info.cantidad_horas
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
          [currency]="this.runStatus?.fund.currency"
          [runPerformance]="this.runStatus?.status"
        ></app-run-performance-chart>

        <div class="fs__no-runs">
          <p *ngIf="!this.runStatus && !this.loadingStatus">
            {{ 'runs.run_summary.no_runs_text' | translate }}
          </p>
        </div>
      </div>

      <div class="ion-padding-top" *ngIf="false">
        <ion-button
          class="ion-margin-top"
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
  styleUrls: ['./run-summary.page.scss'],
})
export class RunSummaryPage implements OnInit, OnDestroy {
  pk: string;
  runStatusSubscription: Subscription;
  loadingStatus = true;
  runStatus: any;

  constructor(private apiRuns: ApiRunsService, private route: ActivatedRoute) {}

  ngOnInit() {}
  ionViewDidEnter() {}

  ionViewWillEnter() {
    this.pk = this.route.snapshot.paramMap.get('pk');
    this.getRunStatus();
  }

  ngOnDestroy() {
    if (!!this.runStatusSubscription) {
      this.runStatusSubscription.unsubscribe();
    }
  }

  getRunStatus() {
    this.loadingStatus = true;
    this.runStatusSubscription = this.apiRuns.getStatus(this.pk).subscribe((res) => {
      this.runStatus = res;
      this.loadingStatus = false;
    });
  }
}
