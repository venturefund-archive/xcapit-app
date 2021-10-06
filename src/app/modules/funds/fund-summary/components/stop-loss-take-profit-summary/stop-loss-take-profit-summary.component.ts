import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-stop-loss-take-profit-summary',
  template: `
    <div class="sl-tp-summary">
      <div class="sl-tp-summary__item">
        <div class="sl-tp-summary__item__text">
          <ion-text class="ux-font-text-base">{{
            'funds.fund_summary.stop_loss_take_profit_summary.take_profit' | translate
          }}</ion-text>
          <ion-text class="ux-font-text-xs sl-tp-summary__item__text__percentage">{{
            this.takeProfit !== 5000
              ? this.takeProfit + ' %'
              : ('funds.fund_summary.stop_loss_take_profit_summary.no_take_profit' | translate)
          }}</ion-text>
        </div>
        <div class="sl-tp-summary__item__buttons">
          <ion-button
            appTrackClick
            name="Change Take Profit"
            class="ux-font-text-xxs"
            fill="clear"
            (click)="this.changeTakeProfit()"
            >{{ 'funds.fund_summary.stop_loss_take_profit_summary.change_button' | translate }}
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </ion-button>
        </div>
      </div>
      <div class="sl-tp-summary__divider"></div>
      <div class="sl-tp-summary__item">
        <div class="sl-tp-summary__item__text">
          <ion-text class="ux-font-text-base">{{
            (this.isTrailing
              ? 'funds.fund_summary.stop_loss_take_profit_summary.trailing_stop_loss'
              : 'funds.fund_summary.stop_loss_take_profit_summary.stop_loss'
            ) | translate
          }}</ion-text>
          <ion-text class="ux-font-text-xs sl-tp-summary__item__text__percentage">{{
            this.stopLoss !== 100
              ? this.stopLoss + ' %'
              : ('funds.fund_summary.stop_loss_take_profit_summary.no_stop_loss' | translate)
          }}</ion-text>
        </div>
        <div class="sl-tp-summary__item__buttons">
          <ion-button
            appTrackClick
            name="Change Stop Loss"
            class="ux-font-text-xxs"
            fill="clear"
            (click)="this.changeStopLoss()"
            >{{ 'funds.fund_summary.stop_loss_take_profit_summary.change_button' | translate }}
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </ion-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./stop-loss-take-profit-summary.component.scss'],
})
export class StopLossTakeProfitSummaryComponent implements OnInit {
  @Input() stopLoss: number;
  @Input() takeProfit: number;
  @Input() isTrailing: boolean;
  constructor(private navController: NavController) {}

  ngOnInit() {}

  async changeStopLoss() {
    await this.navController.navigateBack('funds/fund-stop-loss');
  }

  async changeTakeProfit() {
    await this.navController.navigateBack('funds/fund-take-profit');
  }
}
