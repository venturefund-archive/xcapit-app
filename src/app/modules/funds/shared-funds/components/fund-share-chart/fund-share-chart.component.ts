import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-fund-share-chart',
  template: `
    <div class="fbd__header">
      <ion-text
        class="fbd__header__text ux-font-lato ux-fweight-semibold ux-fsize-16"
      >
        Muestra tus rendimientos
      </ion-text>
      <ion-button
        appTrackClick
        name="Close"
        [dataToTrack]=""
        (click)="this.close()"
        fill="clear"
        size="small"
        color="uxsemidark"
        class="fbd__header__close"
      >
        <ion-icon name="close"></ion-icon>
      </ion-button>
    </div>
    <ion-content class="fbd">
      <div class="fbd__image">
        <ion-item class="fbd__image__content">
          <ion-img
            class="fbd__image__content__img"
            [src]="this.screenshot"
          ></ion-img>
        </ion-item>
      </div>
      <div class="fbd__main_content">
        <div class="fbd__main_content__item">
          <a
            (click)="this.showDownloadToast()"
            [href]="this.screenshot"
            [download]="this.getDownloadFileName()"
            class="fbd__main_content__item__link"
          >
            <ion-icon name="ux-download"></ion-icon>
            <ion-label class="ux-font-lato ux-fweight-regular ux-fsize-14"
              ><ion-text color="uxsemidark">Descargar</ion-text></ion-label
            >
          </a>
        </div>
        <!-- Comentado hasta posterior implementación -->
        <!-- <div class="fbd__main_content__item" (click)="this.shareChart()">
          <ion-icon name="ux-share"></ion-icon>
          <ion-label class="ux-font-lato ux-fweight-regular ux-fsize-14"
            ><ion-text color="uxsemidark">Compartir</ion-text></ion-label
          >
        </div> -->
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-share-chart.component.scss'],
})
export class FundShareChartComponent implements OnInit {
  screenshot: any;

  constructor(
    private modalController: ModalController,
    private shareService: ShareService,
    private translate: TranslateService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  async close() {
    await this.modalController.dismiss();
  }

  getDownloadFileName() {
    return 'chart_screenshot_' + moment().format('YYYY_MM_DD_HH_mm_ss');
  }

  async shareChart() {
    await this.shareService.share(
      {
        title: this.translate.instant('funds.fund_share_chart.share_title'),
        dialogTitle: this.translate.instant(
          'funds.fund_share_chart.share_title'
        ),
        url: this.screenshot,
        text: '',
      },
      this.translate.instant('funds.fund_share_chart.toast_text_copied')
    );
  }

  showDownloadToast() {
    this.toastService.showToast({
      message: this.translate.instant(
        'funds.fund_share_chart.toast_image_downloaded'
      ),
    });
  }
}
