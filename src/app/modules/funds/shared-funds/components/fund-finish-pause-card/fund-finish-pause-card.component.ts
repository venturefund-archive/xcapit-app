import { Component, Input, OnInit } from '@angular/core';
import { log } from 'util';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-fund-finish-pause-card',
  template: `
      <div class="ffp">
          <div class="ffp__content">
              <div class="ffp__content__left">
                  <ion-button
                          appTrackClick
                          name="Pause or Resume Fund"
                          [dataToTrack]="{description: 'status:' + this.status}"
                          (click)="this.pauseResumeFund()"
                          fill="clear"
                          expand="full"
                          [disabled]="!this.status"
                  >
                      <div class="custom-button">
                          <ion-icon class="custom-button__icon" [name]="this.status === 'active' ? 'ux-pause': 'ux-resume'"></ion-icon>
                          <ion-label class="custom-button__label ux-font-lato ux-fweight-regular ux-fsize-14" color="uxsemidark">
                              {{ (
                                  this.status === 'active' ?
                                          'funds.fund_finish_pause_fund_card.pause_fund' :
                                          'funds.fund_finish_pause_fund_card.resume_fund'
                          ) | translate }}
                          </ion-label>
                      </div>
                  </ion-button>
              </div>
              <div class="ffp__content__division"></div>
              <div class="ffp__content__right">
                  <ion-button
                          appTrackClick
                          name="Finish Fund"
                          (click)="this.finishFund()"
                          fill="clear"
                          expand="full"
                          [disabled]="!this.status"
                  >
                      <div class="custom-button">
                          <ion-icon class="custom-button__icon" name="ux-finish"></ion-icon>
                          <ion-label class="custom-button__label ux-font-lato ux-fweight-regular ux-fsize-14" color="uxsemidark">
                              {{ 'funds.fund_finish_pause_fund_card.finish_fund' | translate }}
                          </ion-label>
                      </div>
                  </ion-button>
              </div>
          </div>
      </div>
  `,
  styleUrls: ['./fund-finish-pause-card.component.scss']
})
export class FundFinishPauseCardComponent implements OnInit {

  @Input() fundName: string;
  @Input() runId: string;
  @Input() status: string;

  constructor(
    private apiFunds: ApiFundsService,
    private router: Router,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
  }


  ngOnInit() {
  }

  pauseResumeFund() {
    if (this.status === 'active') {
      this.apiFunds.pauseFundRuns(this.fundName).subscribe(
        res => {
          this.toastService.showToast({ message: this.translate.instant('funds.fund_finish_pause_fund_card.fund_paused') });
          this.status = 'pausado';
        }
      );
    } else {
      this.apiFunds.resumeFundRuns(this.fundName).subscribe(
        res => {
          this.toastService.showToast({ message: this.translate.instant('funds.fund_finish_pause_fund_card.fund_resumed') });
          this.status = 'active';
        }
      );
    }
  }

  finishFund() {
    this.apiFunds.finalizeFundRuns(this.fundName).subscribe(
      res => {
        this.toastService.showToast({ message: this.translate.instant('funds.fund_finish_pause_fund_card.fund_finished') });
        this.router.navigate(['/tabs/funds']);
      }
    );
  }

}
