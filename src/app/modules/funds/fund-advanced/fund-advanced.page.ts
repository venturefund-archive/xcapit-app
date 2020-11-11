import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';

@Component({
  selector: 'app-fund-advanced',
  template: `
  <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <div>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="funds/detail"></ion-back-button>
          </ion-buttons>
        </div>
        <div>
          <ion-title class="fa__header-title ion-text-center">{{
            'funds.fund_detail.header' | translate
          }}</ion-title>
          <ion-title class="fa__header-fund ion-text-center">{{
            this.fundName
          }}</ion-title>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <app-ux-list-accordion
        name="{{ 'funds.fund_detail.fund_metrics_card.sharpe' | translate }}"
        value="{{ this.fundMetrics?.sharpe | number: '1.2-2' }}"
        title="title"
        description="descripcion descripcion descripcion descripcion descripcion descripcion descripcion descripcion descripcion descripcion descripcion descripcion descripcion descripcion descripcion "></app-ux-list-accordion>
      <app-ux-list-accordion
        name="Sortino"
        value="{{ this.fundMetrics?.sortino }}"
        title="title"
        description="descripcion"></app-ux-list-accordion>
    </ion-content>
  `,
  styleUrls: ['./fund-advanced.page.scss'],
})
export class FundAdvancedPage implements OnInit {
  fundName: string;
  fundMetrics: any;

  constructor(
    private route: ActivatedRoute,
    private apiFunds: ApiFundsService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
    this.getFundAdvanceMetrics();
  }

  getFundAdvanceMetrics() {
    this.apiFunds.getMetrics(this.fundName, false).subscribe(data => {
      this.fundMetrics = data.metrics;
    });
  }

}
