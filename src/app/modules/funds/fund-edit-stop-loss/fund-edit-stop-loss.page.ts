import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-edit-stop-loss',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="this.goToFundSettings()"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'funds.fund_stop_loss.edit_title' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-fund-select-stop-loss
        *ngIf="this.stopLoss"
        opType="edit"
        [stopLoss]="this.stopLoss"
        (save)="this.handleSubmit($event)"
      ></app-fund-select-stop-loss>
    </ion-content>
  `,
  styleUrls: ['./fund-edit-stop-loss.page.scss'],
})
export class FundEditStopLossPage implements OnInit {
  fundName: string;
  fund: any;
  stopLoss: number;

  constructor(private route: ActivatedRoute, private apiFunds: ApiFundsService, private navController: NavController) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.apiFunds.getLastFundRun(this.fundName).subscribe((data) => {
      if (data) {
        this.fund = data;
        this.stopLoss = this.fund.perdida;
      }
    });
  }

  serializeFund(fund) {
    const newFundObject = {
      fund_name: fund.nombre_bot,
      id_corrida: fund.id_corrida,
      currency: fund.currency,
      cantidad_dias: fund.cantidad_dias,
      take_profit: fund.ganancia,
      stop_loss: fund.perdida,
      risk_level: fund.nivel_de_riesgo,
    };
    return newFundObject;
  }

  async handleSubmit(data: any) {
    this.fund.perdida = data.stop_loss;
    data = this.serializeFund(this.fund);
    this.apiFunds.crud.update(data, this.fund.id).subscribe(
      () => this.success(),
      (e) => this.error(e)
    );
  }

  async success() {
    this.goToFundSettings();
  }
  async error(e) {
    if (e.error.error_code === 'funds.create.fundNameExists') {
      this.navController.navigateBack(['funds/fund-name']);
    }
  }

  goToFundSettings() {
    this.navController.navigateForward(['/funds/fund-settings', this.fundName]);
  }
}
