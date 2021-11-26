import { Component, Input, OnInit } from '@angular/core';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-finish',
  template: `
    <div class="ffp">
      <div class="ffp__content">
        <ion-button
          appTrackClick
          name="Finish Fund"
          (click)="this.showFinishFundAlert()"
          class="ux_button ffp__content__finish-button"
          color="uxsecondary"
          [disabled]="disabledButton"
        >
          {{ 'funds.fund_finish_pause_fund_card.finish_fund' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./fund-finish.component.scss'],
})
export class FundFinishComponent implements OnInit {
  @Input() fundName: string;
  @Input() runId: string;
  disabledButton = false;

  constructor(
    private apiFunds: ApiFundsService,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  finishFund() {
    this.apiFunds.finalizeFundRuns(this.fundName).subscribe({
      next: () => this.successFinish(),
      complete: () => {
        this.enabledButton();
      },
    });
  }

  async showFinishFundAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('funds.fund_finish_pause_fund_card.alert_header'),
      message: this.translate.instant('funds.fund_finish_pause_fund_card.alert_message'),
      buttons: [
        {
          text: this.translate.instant('funds.fund_finish_pause_fund_card.alert_cancel_button'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (_) => this.enabledButton(),
        },
        {
          text: this.translate.instant('funds.fund_finish_pause_fund_card.alert_finish_button'),
          handler: (_) => this.finishFund(),
        },
      ],
    });
    this.disabledButton = true;
    await alert.present();
  }

  successFinish() {
    this.navController.navigateBack(['/tabs/funds']).then(() => this.showToast());
  }

  async showToast() {
    await this.toastService.showToast({
      cssClass: 'ux-toast-info',
      message: this.translate.instant('funds.fund_finish_pause_fund_card.fund_finished'),
    });
  }

  private enabledButton() {
    this.disabledButton = false;
  }
}
