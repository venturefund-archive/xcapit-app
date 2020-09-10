import { Component, Input, OnInit } from '@angular/core';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-finish',
  template: `
      <div class="ffp">
          <div class="ffp__content">
              <ion-button
                      appTrackClick
                      name="Finish Fund"
                      (click)="this.finishFund()"
                      fill="clear"
                      class="ux-button ffp__content__finish-button"
                      color="uxdanger"
              >
                  {{
                  'funds.fund_finish_pause_fund_card.finish_fund' | translate
                  }}
              </ion-button>
          </div>
      </div>
  `,
  styleUrls: ['./fund-finish.component.scss']
})
export class FundFinishComponent implements OnInit {
  @Input() fundName: string;
  @Input() runId: string;

  constructor(
    private apiFunds: ApiFundsService,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
  }

  finishFund() {
    this.apiFunds.finalizeFundRuns(this.fundName).subscribe(() => this.successFinish());
  }

  successFinish() {
    this.navController.navigateBack(['/tabs/funds']).then(
      () => this.showToast()
    );
  }

  async showToast() {
    await this.toastService.showToast({
      message: this.translate.instant(
        'funds.fund_finish_pause_fund_card.fund_finished'
      )
    });
  }
}
