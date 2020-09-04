import { Component, OnInit } from '@angular/core';
import { ApiDaService } from '../shared-deposit-addresses/services/api-da.service';
import QRCode from 'qrcode';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Plugins } from '@capacitor/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
const { Clipboard } = Plugins;

@Component({
  selector: 'app-deposit-address',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'deposit_addresses.deposit_address.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content">
          <app-ux-title>
            <div class="ion-margin-top">
              {{ 'deposit_addresses.deposit_address.title' | translate }}
            </div>
          </app-ux-title>

          <app-ux-text class="ion-margin-bottom">
            <div class="ion-margin-top">
              {{ 'deposit_addresses.deposit_address.text_before' | translate }}
            </div>
          </app-ux-text>

          <div class="da ion-padding-top ion-margin-top ion-padding-bottom">
            <app-ux-loading-block
              *ngIf="!depositAddresInfo"
              minSize="40px"
            ></app-ux-loading-block>

            <div class="da__main ion-padding-start ion-padding-end" *ngIf="depositAddresInfo">
              <app-ux-text>
                <div class="da__main__title">
                  {{ 'deposit_addresses.deposit_address.address_title' | translate }}
                </div>
              </app-ux-text>
              <div class="da__main__content ion-margin-bottom">
                <div class="da__main__content__title">
                  <app-ux-text>
                    <div class="da__main__content__left">
                      {{ depositAddresInfo.address }}
                    </div>
                  </app-ux-text>
                </div>
                <div class="da__main__content_right">
                  <ion-buttons>
                    <ion-button
                      appTrackClick
                      name="Copy Deposit Address"
                      (click)="this.copyToClipboard()"
                    >
                      <ion-icon slot="icon-only" name="copy"></ion-icon>
                    </ion-button>
                  </ion-buttons>
                </div>
              </div>

              <div class="list-divider"></div>

              <div *ngIf="depositAddresInfo.addressTag">
                <div class="da__main__content__title">
                  <app-ux-text>
                    <div class="da__main__title">
                      {{ 'deposit_addresses.deposit_address.address_tag_title' | translate }}
                    </div>
                  </app-ux-text>
                </div>
                <div class="da__main__content">
                  <app-ux-text>
                    <div class="da__main__content__left">
                      {{ depositAddresInfo.addressTag }}
                    </div>
                  </app-ux-text>
                </div>

                <div class="list-divider"></div>
              </div>

              <div *ngIf="depositAddresInfo.url">
                <app-ux-text>
                  <div class="da__main__title">
                    {{ 'deposit_addresses.deposit_address.link_title' | translate }}
                  </div>
                </app-ux-text>
                <div class="da__main__content">
                  <div class="da__main__content__title">
                    <app-ux-text>
                      <div class="da__main__content__left">
                        {{ depositAddresInfo.url }}
                      </div>
                    </app-ux-text>
                  </div>
                  
                  <div class="da__main__content_right">
                    <ion-buttons>
                      <ion-button
                        appTrackClick
                        name="Open URL Deposit Address"
                        (click)="this.openAddressUrlInNewTab()"
                      >
                        <ion-icon slot="icon-only" name="open"></ion-icon>
                      </ion-button>
                    </ion-buttons>
                  </div>
                </div>

                <div class="list-divider"></div>
              </div>


              <div *ngIf="this.qrCode">
                <app-ux-text>
                  <div class="da__main__title">
                    {{ 'deposit_addresses.deposit_address.qr_title' | translate }}
                  </div>
                </app-ux-text>
                  <div class="qr-code-container">
                    <img
                      [src]="this.qrCode"
                      width="70%"
                      alt="Address link QR Code"
                    />
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div class="ux_footer">
          <ion-button
            appTrackClick
            name="Back Home"
            fill="clear"
            size="large"
            expand="block"
            type="button"
            color="uxsecondary"
            [routerLink]="['/tabs/funds']"
            class="ux_button"
          >
            {{ 'deposit_addresses.deposit_address.back_link' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./deposit-address.page.scss'],
})
export class DepositAddressPage implements OnInit {
  depositAddresInfo: any;
  qrCode: string;
  currency: string;


  constructor(
    private apiDa: ApiDaService,
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) { }

  getDepositAdress(currency: string) {
    this.apiDa.getDepositAddress(currency).pipe(take(1)).subscribe(res => {
      this.depositAddresInfo = res;
      if (this.depositAddresInfo.url) {
        this.generateQR(this.depositAddresInfo.url);
      }
    });
  }

  generateQR(depositAddressUrl: string) {
    QRCode.toDataURL(depositAddressUrl)
      .then(url => {
        this.qrCode = url;
      })
      .catch(err => {
        console.error(err);
      });
  }

  ionViewWillEnter() {
    this.currency = this.route.snapshot.paramMap.get('currency');
    if (this.currency) {
      this.getDepositAdress(this.currency);
    }
  }

  ngOnInit() {}

  openAddressUrlInNewTab() {
    if (this.depositAddresInfo.url) {
      // esto se usa porque ionic tiene un bug en que el ion-button no
      // toma los attr target y rel, si se actualiza a una versión
      // >= a la 4.6 debería estar resuelto
      window.open(this.depositAddresInfo.url, '_blank');
    }
  }

  copyToClipboard() {
    if (this.depositAddresInfo.address) {
      this.clipboardService.write({ url: this.depositAddresInfo.address }).then(
        () => {
          this.showToast('deposit_addresses.deposit_address.copy_address_ok_text');
        },
        () => {
          this.showToast('deposit_addresses.deposit_address.copy_address_error_text');
        }
      );
    }
  }

  private showToast(text: string) {
    this.toastService.showToast({
      message: this.translate.instant(text)
    });
  }

}
