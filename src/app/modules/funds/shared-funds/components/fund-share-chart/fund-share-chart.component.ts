import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Plugins, FilesystemDirectory } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';

const { Filesystem } = Plugins;

@Component({
  selector: 'app-fund-share-chart',
  template: `
    <div class="fbd__header">
      <ion-text class="fbd__header__text ux-font-text-base semibold"> Muestra tus rendimientos </ion-text>
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
          <ion-img class="fbd__image__content__img" [src]="this.screenshot"></ion-img>
        </ion-item>
      </div>
      <div class="fbd__main_content">
        <div class="fbd__main_content__item" (click)="this.downloadChart()">
          <a
            id="pwa_download"
            [href]="this.screenshot"
            [download]="this.getDownloadFileName()"
            class="fbd__main_content__item__link"
          >
          </a>
          <ion-icon name="ux-download"></ion-icon>
          <ion-label class="ux-font-text-xs"><ion-text color="uxsemidark">Descargar</ion-text></ion-label>
        </div>
        <!-- Comentado hasta posterior implementación -->
        <!-- <div class="fbd__main_content__item" (click)="this.shareChart()">
          <ion-icon name="ux-share"></ion-icon>
          <ion-label class="ux-font-text-xs"
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
    private toastService: ToastService,
    private fileOpener: FileOpener
  ) {}

  ngOnInit() {}

  async close() {
    await this.modalController.dismiss();
  }

  async shareChart() {
    await this.shareService.share(
      {
        title: this.translate.instant('funds.fund_share_chart.share_title'),
        dialogTitle: this.translate.instant('funds.fund_share_chart.share_title'),
        url: this.screenshot,
        text: '',
      },
      this.translate.instant('funds.fund_share_chart.toast_text_copied')
    );
  }

  downloadChart() {
    if (Capacitor.isNative) {
      this.nativeDownload();
    } else {
      this.pwaDownload();
    }
  }

  nativeDownload() {
    const fileName = `${this.getDownloadFileName()}.png`;
    Filesystem.writeFile({
      path: fileName,
      data: this.screenshot, // your data to write (ex. base64)
      directory: FilesystemDirectory.Documents,
    }).then((savedFile) => {
      this.showToast('funds.fund_share_chart.toast_image_downloaded');
      const path = savedFile.uri;
      const mimeType = 'image/png';
      this.openImage(path, mimeType);
    });
  }

  pwaDownload() {
    const element: HTMLElement = document.getElementById('pwa_download') as HTMLElement;
    element.click();
  }

  getDownloadFileName() {
    return 'chart_screenshot_' + moment().format('YYYY_MM_DD_HH_mm_ss');
  }

  showToast(translateCode) {
    this.toastService.showToast({
      message: this.translate.instant(translateCode),
    });
  }

  openImage(path, mimeType) {
    this.fileOpener.showOpenWithDialog(path, mimeType);
  }
}
