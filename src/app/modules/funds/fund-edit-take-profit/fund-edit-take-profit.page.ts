import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-edit-take-profit',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="this.goToFundSettings()"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'funds.fund_take_profit.edit_title' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-fund-select-take-profit
        *ngIf="this.takeProfit"
        opType="edit"
        [takeProfit]="this.takeProfit"
        [profile]="this.profile"
        (save)="this.handleSubmit($event)"
      ></app-fund-select-take-profit>
    </ion-content>
  `,
  styleUrls: ['./fund-edit-take-profit.page.scss'],
})
export class FundEditTakeProfitPage implements OnInit {
  fundName: string;
  fund: any;
  takeProfit: number;
  profile: string;

  constructor(private route: ActivatedRoute, private apiFunds: ApiFundsService, private navController: NavController) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.apiFunds.getLastFundRun(this.fundName).subscribe((data) => {
      if (data) {
        this.fund = data;
        this.takeProfit = this.fund.ganancia;
        this.profile = this.fund.nivel_de_riesgo;
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
    this.fund.ganancia = data.take_profit;
    data = this.serializeFund(this.fund);
    this.apiFunds.crud.update(data, this.fund.id).subscribe(() => this.success());
  }

  async success() {
    this.goToFundSettings();
  }

  goToFundSettings() {
    this.navController.navigateForward(['/funds/fund-settings', this.fundName]);
  }
}
