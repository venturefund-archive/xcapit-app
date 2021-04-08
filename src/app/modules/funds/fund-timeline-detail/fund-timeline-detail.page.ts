import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-timeline-detail',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="/funds/detail/{{ this.fundName }}"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'funds.fund_take_profit.header_renew' | translate }}</ion-title
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="atd">
        <div class="atd__chart-card"></div>
        <div class="atd__performance-card"></div>
        <div class="atd__config-card">
          <div class="atd__config__title">
            <ion-text
              class="ux-font-lato ux-fweight-semibold ux-fsize-12"
              color="uxsemidark"
            >
              {{ 'funds.fund_timeline_detail.config_card.title' | translate }}
            </ion-text>
          </div>
          <div class="atd__config__content">
            <div class="atd__config__content__item">
              <div class="atd__config__content__item__label">
                <ion-label>{{ 'funds.fund_timeline_detail.config_card.item.state' | translate }}</ion-label>
              </div>
              <div class="atd__config__content__item__value">Finalizado</div>
            </div>
            <div class="atd__config__content__item">
              <div class="atd__config__content__item__label">
                <ion-label>{{ 'funds.fund_timeline_detail.config_card.item.initial_date' | translate }}</ion-label>
              </div>
              <div class="atd__config__content__item__value">
                08 de junio del 2020
              </div>
            </div>
            <div class="atd__config__content__item">
              <div class="atd__config__content__item__label">
                <ion-label>{{ 'funds.fund_timeline_detail.config_card.item.take_profit' | translate }}</ion-label>
              </div>
              <div class="atd__config__content__item__value">10%</div>
            </div>
            <div class="atd__config__content__item">
              <div class="atd__config__content__item__label">
                <ion-label>{{ 'funds.fund_timeline_detail.config_card.item.stop_loss' | translate }}</ion-label>
              </div>
              <div class="atd__config__content__item__value">-10%</div>
            </div>
            <div class="atd__config__content__item">
              <div class="atd__config__content__item__label">
                <ion-label>{{ 'funds.fund_timeline_detail.config_card.item.currency' | translate }}</ion-label>
              </div>
              <div class="atd__config__content__item__value">Finalizado</div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-timeline-detail.page.scss'],
})
export class FundTimelineDetailPage implements OnInit {
  fundName: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
  }
}
