import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';
import { FundFormActions } from '../shared-funds/enums/fund-form-actions.enum';
import { CA } from '../shared-funds/enums/ca.enum';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { StateNamesService } from 'src/app/shared/services/state-names/state-names.service';

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
        <ion-buttons slot="end">
          <ion-button (click)="this.editFund()" [disabled]="!this.fundStatus">
            <ion-icon slot="icon-only" name="create"></ion-icon>
          </ion-button>
        </ion-buttons>
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
            {{ this.statusShowName }}
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
              {{ this.fundStatus | currencyPercentage | number: '1.2-2' }}%
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

        <app-fund-performance-chart
          *ngIf="this.fundStatus"
          [currency]="this.fundStatus?.fund.currency"
          [fundPerformance]="this.fundStatus?.status?.rendimiento"
        ></app-fund-performance-chart>

        <div class="fs__no-runs">
          <p *ngIf="!this.fundStatus && !this.loadingStatus">
            {{ 'funds.fund_summary.no_runs_text' | translate }}
          </p>

          <ion-button
            *ngIf="!this.fundStatus && !this.loadingStatus"
            type="button"
            color="primary"
            expand="block"
            size="medium"
            (click)="renewFund()"
          >
            <ion-icon slot="start" name="refresh"></ion-icon>
            {{ 'funds.fund_summary.renew_fund_button' | translate }}
          </ion-button>
        </div>
      </div>
      <ion-grid no-padding padding-top>
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
              *ngIf="
                this.fundStatus?.fund.estado == 'active' || this.inCAStatus
              "
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
          <ion-col
            *ngIf="
              this.fundStatus?.fund.estado == 'active' ||
              this.fundStatus?.fund.estado == 'pausado'
            "
          >
            <ion-button
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
        <form
          [formGroup]="this.form"
          (ngSubmit)="this.changeFundCA()"
          style="width:100%;"
        >
          <ion-row
            align-items-end
            *ngIf="this.fundStatus?.fund.estado == 'pausado'"
          >
            <ion-col>
              <ion-item>
                <ion-label position="floating">
                  {{ 'funds.fund_summary.change_fund_ca' | translate }}
                </ion-label>
                <ion-select formControlName="ca">
                  <ion-select-option [value]="this.CAEnum.BTC">
                    {{ this.CAEnum.BTC }}
                  </ion-select-option>
                  <ion-select-option [value]="this.CAEnum.USDT">
                    {{ this.CAEnum.USDT }}
                  </ion-select-option>
                  <ion-select-option [value]="this.CAEnum.BNB">
                    {{ this.CAEnum.BNB }}
                  </ion-select-option>
                  <ion-select-option [value]="this.CAEnum.ETH">
                    {{ this.CAEnum.ETH }}
                  </ion-select-option>
                  <ion-select-option [value]="this.CAEnum.LTC">
                    {{ this.CAEnum.LTC }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-button
                expand="block"
                size="medium"
                type="submit"
                color="primary"
              >
                <ion-icon slot="start" name="checkmark"></ion-icon>
                {{ 'funds.fund_summary.change_fund_ca_button' | translate }}
              </ion-button></ion-col
            >
          </ion-row>
        </form>
      </ion-grid>
      <div class="ion-padding-top">
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

        <ion-button
          margin-top
          expand="block"
          size="medium"
          type="button"
          color="tertiary"
          routerDirection="forward"
          [routerLink]="['/funds/fund-balance', this.fundName]"
          [disabled]="!this.fundStatus?.status"
        >
          {{ 'funds.fund_summary.fund_balance_button' | translate }}
        </ion-button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-summary.page.scss']
})
export class FundSummaryPage implements OnInit, OnDestroy {
  loadingStatus = true;

  fundName: string;

  fundStatus: any;
  form: FormGroup = this.formBuilder.group({
    ca: [undefined, [Validators.required]]
  });
  fundStatusSubscription: Subscription;
  CAEnum = CA;
  inCAStatus = false;
  statusShowName: string;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private apiFunds: ApiFundsService,
    private subscriptionsService: SubscriptionsService,
    private stateNamesService: StateNamesService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.fundStatusSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.getFundStatus();
  }

  shareFund() {
    this.subscriptionsService.shareSubscriptionLink(this.fundName);
  }


  getStateShowName(state: string) {
    return this.stateNamesService.getStateShowName(state);
  }


  getFundStatus() {
    this.loadingStatus = true;
    this.fundStatusSubscription = this.apiFunds
      .getStatus(this.fundName)
      .subscribe(res => {
        this.fundStatus = res;
        this.isInCAStatus();
        this.statusShowName = this.stateNamesService.getStateShowName(this.fundStatus.fund.estado);
        this.loadingStatus = false;
      });
  }

  isInCAStatus() {
    if (this.fundStatus) {
      const estado = this.fundStatus.fund.estado;
      const re = /^to[A-Z]*-NF$/;
      if (estado.match(re)) {
        this.inCAStatus = true;
      } else {
        this.inCAStatus = false;
      }
    }
  }

  changeFundCA(): void {
    if (this.form.valid) {
      this.apiFunds
        .changeFundCA(this.fundName, this.form.value.ca)
        .subscribe(res => {
          this.getFundStatus();
        });
    }
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

  renewFund(): void {
    this.router.navigate([
      'funds/action',
      FundFormActions.RenewFund,
      this.fundName
    ]);
  }

  fundRuns(selectedFund: string): void {
    this.router.navigate(['funds/runs', selectedFund]);
  }

  editFund() {
    this.router.navigate([
      '/funds/action',
      FundFormActions.EditProfitLoss,
      this.fundName
    ]);
  }
}
