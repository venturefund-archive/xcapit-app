import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';
import { FundFormActions } from '../shared-funds/enums/fund-form-actions.enum';
import { CA } from '../shared-funds/enums/ca.enum';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { StateNamesService } from 'src/app/shared/services/state-names/state-names.service';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ApiSubscriptionsService } from '../../subscriptions/shared-subscriptions/services/api-subscriptions/api-subscriptions.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-fund-summary',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/list"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'funds.fund_summary.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button
            *ngIf="this.isOwner"
            appTrackClick
            name="Edit Fund"
            (click)="this.editFund()"
            [disabled]="!this.fundStatus"
          >
            <ion-icon slot="icon-only" name="create"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button
          *ngIf="this.isOwner"
          (click)="this.shareFund()"
          appTrackClick
          name="Share Fund"
        >
          <ion-icon name="share"></ion-icon>
        </ion-fab-button>
        <ion-fab-button
          *ngIf="!this.isOwner"
          (click)="this.unsubscribeAlert()"
          appTrackClick
          name="Unsubscribe Fund"
        >
          <ion-icon name="remove-circle-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <div class="fs" *ngIf="!this.loadingStatus">
        <div class="fs__header">
          <h1>{{ this.fundName }}</h1>
          <ion-label class="fs__header__state">
            {{ this.statusShowName }}
          </ion-label>
        </div>
        <div class="fs__content" *ngIf="this.fundStatus">
          <div class="fs__profit" *ngIf="this.fundStatus.status">
            <div class="fs__profit__main">
              <app-percentage-display
                [percentage]="this.fundStatus.status.porcentaje"
              ></app-percentage-display>
            </div>
            <div class="fs__profit__days">
              {{
                'funds.fund_summary.profit_text'
                  | translate
                    : {
                        days: this.fundStatus.status.date_info.cantidad_dias,
                        hours: this.fundStatus.status.date_info.cantidad_horas
                      }
              }}
            </div>
          </div>
          <div class="fs__days-left" *ngIf="this.fundStatus.status">
            <p
              *ngIf="
                this.fundStatus.status.date_info.cantidad_dias_inicio_restantes < 0;
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
                          days: this.fundStatus.status.date_info
                            .cantidad_dias_inicio_restantes,
                          hours: this.fundStatus.status.date_info
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
            appTrackClick
            name="Renew Fund"
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
      <ion-grid no-padding padding-top *ngIf="this.isOwner">
        <ion-row>
          <ion-col>
            <ion-button
              *ngIf="this.fundStatus?.fund.estado == 'pausado'"
              appTrackClick
              name="Resume Fund"
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
              appTrackClick
              name="Pause Fund"
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
              appTrackClick
              name="Finalize Fund"
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
                <ion-select
                  appTrackClick
                  [dataToTrack]="{
                    eventLabel: 'Select Currency to Change'
                  }"
                  formControlName="ca"
                >
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
                appTrackClick
                name="Change Fund CA"
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
      <div *ngIf="!this.loadingStatus" class="ion-padding-top">
        <ion-button
          appTrackClick
          name="Runs Fund"
          expand="block"
          size="medium"
          type="button"
          color="success"
          routerDirection="forward"
          [routerLink]="['/funds/runs', this.fundName]"
        >
          <ion-icon slot="start" name="list"></ion-icon>
          {{ 'funds.fund_summary.fund_runs_button' | translate }}
        </ion-button>

        <ion-button
          appTrackClick
          name="Fund Balance"
          margin-top
          expand="block"
          size="medium"
          type="button"
          color="tertiary"
          routerDirection="forward"
          [routerLink]="['/funds/fund-balance', this.fundName]"
          *ngIf="this.fundStatus?.status"
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
  isOwner = false;

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
    private apiFunds: ApiFundsService,
    private subscriptionsService: SubscriptionsService,
    private stateNamesService: StateNamesService,
    private alertController: AlertController,
    private translate: TranslateService,
    private apiSubscriptions: ApiSubscriptionsService,
    private navController: NavController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.fundStatusSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.getFundStatus();
  }

  ionViewDidEnter() {}

  shareFund() {
    this.subscriptionsService.shareSubscriptionLink(this.fundName);
  }

  async unsubscribeAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('funds.fund_summary.unsubscribe_header'),
      message: this.translate.instant('funds.fund_summary.unsubscribe_message'),
      buttons: [
        {
          text: this.translate.instant(
            'funds.fund_summary.unsubscribe_cancel_button'
          ),
          role: 'cancel'
        },
        {
          text: this.translate.instant(
            'funds.fund_summary.unsubscribe_accept_button'
          ),
          handler: () => this.unsubscribe()
        }
      ]
    });
    await alert.present();
  }

  unsubscribe() {
    this.apiSubscriptions.unsubscribeToFund(this.fundName).subscribe(() => {
      this.navController
        .navigateBack(['/funds/list'], { replaceUrl: true })
        .then(() => {
          this.toastService.showToast({
            message: this.translate.instant(
              `funds.fund_summary.unsubscribe_success_message`
            )
          });
        });
    });
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
        this.isOwner = res && res.fund && res.fund.is_owner;
        this.isInCAStatus();
        this.statusShowName = this.stateNamesService.getStateShowName(
          (this.fundStatus && this.fundStatus.fund.estado) || '-'
        );
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
    this.navController.navigateForward([
      'funds/action',
      FundFormActions.RenewFund,
      this.fundName
    ]);
  }

  editFund() {
    this.navController.navigateForward([
      '/funds/action',
      FundFormActions.EditProfitLoss,
      this.fundName
    ]);
  }
}
