import { Component, OnInit, Input } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { NavParams } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fund-runs',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ 'funds.fund_runs.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <ion-text
          >{{ 'funds.fund_runs.subheader' | translate }}:
          {{ selectedFund }}</ion-text
        >
        <ion-card *ngFor="let run of fundRuns">
          <ion-card-header>
            <ion-card-title>{{
              'funds.fund_runs.card_title' | translate
            }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <!-- Configuracion -->

            <ion-item-divider>
              <ion-label>
                {{ 'funds.fund_runs.configuration_title' | translate }}
              </ion-label>
            </ion-item-divider>
            <ion-row>
              <ion-col
                >{{ 'funds.fund_runs.state_title' | translate }}:</ion-col
              >
              <ion-col
                ><ion-badge color="primary">{{
                  run.estado
                }}</ion-badge></ion-col
              >
            </ion-row>
            <ion-row>
              <ion-col
                >{{ 'funds.fund_runs.init_date_title' | translate }}:</ion-col
              >
              <ion-col>{{
                run.fecha_inicio | date: 'dd/MM/yyyy hh:mm'
              }}</ion-col>
            </ion-row>
            <ion-row>
              <ion-col>{{ 'funds.fund_runs.days_title' | translate }}:</ion-col>
              <ion-col>{{ run.cantidad_dias }}</ion-col>
            </ion-row>
            <ion-row>
              <ion-col
                >{{ 'funds.fund_runs.currency_title' | translate }}:</ion-col
              >
              <ion-col>{{ run.currency }}</ion-col>
            </ion-row>
            <ion-row>
              <ion-col>{{ 'funds.fund_runs.gain_title' | translate }}:</ion-col>
              <ion-col>{{ run.ganancia }}%</ion-col>
            </ion-row>
            <ion-row>
              <ion-col>{{ 'funds.fund_runs.loss_title' | translate }}:</ion-col>
              <ion-col>{{ run.perdida }}%</ion-col>
            </ion-row>
            <!-- Monto inicial -->
            <div class="monto-actual" *ngIf="run.first_state">
            <ion-item-divider>
              <ion-label>
                {{ 'funds.fund_runs.starting_amount_title' | translate }}
              </ion-label>
            </ion-item-divider>
            <ion-row>
              <ion-col
                >{{ 'funds.fund_runs.cant_btc_title' | translate }}:</ion-col
              >
              <ion-col
                ><ion-col
                  >{{ 'funds.fund_runs.cant' | translate }}
                  {{ run.first_state.cant_btc }}</ion-col
                >-<ion-col>$ {{ run.first_state.precio_btc }}</ion-col></ion-col
              >
            </ion-row>
            <ion-row>
              <ion-col
                >{{ 'funds.fund_runs.cant_eth_title' | translate }}:</ion-col
              >
              <ion-col
                ><ion-col
                  >{{ 'funds.fund_runs.cant' | translate }}
                  {{ run.first_state.cant_eth }}</ion-col
                >-<ion-col>$ {{ run.first_state.precio_eth }}</ion-col></ion-col
              >
            </ion-row>
            <ion-row>
              <ion-col
                >{{ 'funds.fund_runs.cant_xrp_title' | translate }}:</ion-col
              >
              <ion-col
                ><ion-col
                  >{{ 'funds.fund_runs.cant' | translate }}
                  {{ run.first_state.cant_xrp }}</ion-col
                >-<ion-col>$ {{ run.first_state.precio_xrp }}</ion-col></ion-col
              >
            </ion-row>
            <ion-row>
              <ion-col
                >{{ 'funds.fund_runs.cant_bnb_title' | translate }}:</ion-col
              >
              <ion-col
                ><ion-col
                  >{{ 'funds.fund_runs.cant' | translate }}
                  {{ run.first_state.cant_bnb }}</ion-col
                >-<ion-col>$ {{ run.first_state.precio_bnb }}</ion-col></ion-col
              >
            </ion-row>
            <ion-row>
              <ion-col
                >{{ 'funds.fund_runs.cant_usdt_title' | translate }}:</ion-col
              >
              <ion-col
                ><ion-col
                  >{{ 'funds.fund_runs.cant' | translate }}
                  {{ run.first_state.cant_usdt }}</ion-col
                ></ion-col
              >
            </ion-row>
            </div>
            <!-- Monto actual -->
            <div class="monto-actual" *ngIf="run.last_state">
            <ion-item-divider>
              <ion-label>
                {{ 'funds.fund_runs.actual_amount_title' | translate }}
              </ion-label>
            </ion-item-divider>
            <ion-row>
              <ion-col
                >{{ 'funds.fund_runs.cant_btc_title' | translate }}:</ion-col
              >
              <ion-col
                ><ion-col
                  >{{ 'funds.fund_runs.cant' | translate }}
                  {{ run.last_state.cant_btc }}</ion-col
                >-<ion-col>$ {{ run.last_state.precio_btc }}</ion-col></ion-col
              >
            </ion-row>
            <ion-row>
              <ion-col
                >{{ 'funds.fund_runs.cant_eth_title' | translate }}:</ion-col
              >
              <ion-col
                ><ion-col
                  >{{ 'funds.fund_runs.cant' | translate }}
                  {{ run.last_state.cant_eth }}</ion-col
                >-<ion-col>$ {{ run.last_state.precio_eth }}</ion-col></ion-col
              >
            </ion-row>
            <ion-row>
              <ion-col
                >{{ 'funds.fund_runs.cant_xrp_title' | translate }}:</ion-col
              >
              <ion-col
                ><ion-col
                  >{{ 'funds.fund_runs.cant' | translate }}
                  {{ run.last_state.cant_xrp }}</ion-col
                >-<ion-col>$ {{ run.last_state.precio_xrp }}</ion-col></ion-col
              >
            </ion-row>
            <ion-row>
              <ion-col
                >{{ 'funds.fund_runs.cant_bnb_title' | translate }}:</ion-col
              >
              <ion-col
                ><ion-col
                  >{{ 'funds.fund_runs.cant' | translate }}
                  {{ run.last_state.cant_bnb }}</ion-col
                >-<ion-col>$ {{ run.last_state.precio_bnb }}</ion-col></ion-col
              >
            </ion-row>
            <ion-row>
              <ion-col
                >{{ 'funds.fund_runs.cant_usdt_title' | translate }}:</ion-col
              >
              <ion-col
                ><ion-col
                  >{{ 'funds.fund_runs.cant' | translate }}
                  {{ run.last_state.cant_usdt }}</ion-col
                ></ion-col
              >
            </ion-row>
            </div>

            <ion-item-divider> </ion-item-divider>
            <ion-row *ngIf="run.porcentaje_ganancia">
              <ion-col
                >{{
                  'funds.fund_runs.gain_current_currency_title' | translate
                }}
                {{ run.currency }}:</ion-col
              ><ion-col
                ><ion-badge
                  color="{{
                    run.porcentaje_ganancia > 0 ? 'success' : 'danger'
                  }}"
                  >{{ run.porcentaje_ganancia | number: '1.2-2' }} %</ion-badge
                ></ion-col
              >
            </ion-row>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-runs.page.scss']
})
export class FundRunsPage implements OnInit {
  fundRuns: Array<any> = [];
  selectedFund: string;
  status: string;

  constructor(
    private apiFundsService: ApiFundsService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.selectedFund = params.nombre_bot;
    });
    this.status = 'all';
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getFundRuns();
  }

  private getFundRuns() {
    this.apiFundsService
      .getFundRuns(this.status, this.selectedFund)
      .subscribe(res => {
        this.fundRuns = res;
      });
  }
}
