import { Component, OnInit } from '@angular/core';
import { WalletConnectService } from '../../shared-wallets/services/wallet-connect/wallet-connect.service';
import { WalletConnectSignRequestComponent } from '../../shared-wallets/components/wallet-connect-sign-request/wallet-connect-sign-request.component';
import { NavController } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ethers } from 'ethers';
import * as moment from 'moment';

@Component({
  selector: 'app-operation-detail',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-title class="ion-text-center">
          {{ 'wallets.wallet_connect.operation_detail.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ux_content">
        <div class="wcod">
          <div class="wcod__logo">
            <img src="{{ this.peerMeta?.icons[0] }}" />
          </div>

          <div class="wcod__provider_name">
            <ion-label *ngIf="this.isSignRequest">
              {{ 'wallets.wallet_connect.operation_detail.sign' | translate }} {{ this.peerMeta?.name }}
            </ion-label>
            <ion-label *ngIf="!this.isSignRequest && this.isApproval">
              {{ 'wallets.wallet_connect.operation_detail.approval' | translate }} {{ this.peerMeta?.name }}
            </ion-label>
            <ion-label *ngIf="!this.isSignRequest && !this.isApproval">
              {{ 'wallets.wallet_connect.operation_detail.operation' | translate }} {{ this.peerMeta?.name }}
            </ion-label>
          </div>

          <div class="wcod__transaction_detail">
            <div class="wcod__transaction_detail__container">
              <div class="wcod__transaction_detail__container__title">
                <ion-label>
                  {{ 'wallets.wallet_connect.operation_detail.date' | translate }}
                </ion-label>
              </div>

              <div class="wcod__transaction_detail__container__content wcod__transaction_detail__container__date">
                <span>{{ this.date }}</span>
                <span>{{ this.time }} H</span>
              </div>
            </div>

            <div *ngIf="!this.isSignRequest">
              <div class="wcod__transaction_detail__container">
                <div class="wcod__transaction_detail__container__title">
                  <ion-label>
                    {{ 'wallets.wallet_connect.operation_detail.from' | translate }}
                  </ion-label>
                </div>

                <div class="wcod__transaction_detail__container__content">
                  <ion-label>
                    {{ this.transactionDetail?.params[0].from }}
                  </ion-label>
                </div>
              </div>

              <div class="wcod__transaction_detail__container">
                <div class="wcod__transaction_detail__container__title">
                  <ion-label>
                    {{ 'wallets.wallet_connect.operation_detail.to' | translate }}
                  </ion-label>
                </div>

                <div class="wcod__transaction_detail__container__content">
                  <ion-label>
                    {{ this.transactionDetail?.params[0].to }}
                  </ion-label>
                </div>
              </div>

              <div class="wcod__transaction_detail__container" *ngIf="this.totalAmount">
                <div class="wcod__transaction_detail__container__title">
                  <ion-label>
                    {{ 'wallets.wallet_connect.operation_detail.amount' | translate }}
                  </ion-label>
                </div>

                <div class="wcod__transaction_detail__container__content">
                  <ion-label> {{ this.totalAmount }} {{ this.providerSymbol }} </ion-label>
                </div>
              </div>

              <div class="wcod__transaction_detail__container">
                <div class="wcod__transaction_detail__container__title">
                  <ion-label>
                    {{ 'wallets.wallet_connect.operation_detail.transaction_fee' | translate }}<span>*</span>
                  </ion-label>
                </div>
                <div class="wcod__transaction_detail__container__info">
                  <ion-label>
                    <span>*</span>{{ 'wallets.wallet_connect.operation_detail.transaction_fee_message' | translate }}
                  </ion-label>
                </div>

                <div class="wcod__transaction_detail__container__content">
                  <ion-label> {{ this.totalFeeAmount }} {{ this.providerSymbol }} </ion-label>
                </div>
              </div>
            </div>

            <div *ngIf="this.isSignRequest" class="wcod__transaction_detail__sign_request">
              <ion-label>
                {{ 'wallets.wallet_connect.operation_detail.sign_message' | translate }}
              </ion-label>

              <div class="wcod__transaction_detail__sign_request__message_container" id="message">
                {{ this.message }}
              </div>
            </div>
          </div>

          <div class="wcod__button_section">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Next"
              color="uxsecondary"
              size="large"
              (click)="confirmOperation()"
            >
              <div *ngIf="this.isSignRequest">
                {{ 'wallets.wallet_connect.operation_detail.sign_button' | translate }}
              </div>
              <div *ngIf="!this.isSignRequest && this.isApproval">
                {{ 'wallets.wallet_connect.operation_detail.approve_button' | translate }}
              </div>
              <div *ngIf="!this.isSignRequest && !this.isApproval">
                {{ 'wallets.wallet_connect.operation_detail.confirm_button' | translate }}
              </div>
            </ion-button>

            <ion-button
              class="ux_button"
              appTrackClick
              name="Next"
              color="light"
              size="large"
              (click)="cancelOperation()"
            >
              {{ 'wallets.wallet_connect.operation_detail.cancel_button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./operation-detail.page.scss'],
})
export class OperationDetailPage implements OnInit {
  public peerMeta;
  public isSignRequest = true;
  public isApproval = false;
  public transactionConfirmed = false;
  public transactionDetail;
  public message: any;
  public date;
  public time;
  public totalFeeAmount;
  public totalAmount = null;
  public providerSymbol = '';

  constructor(
    private walletConnectService: WalletConnectService,
    private navController: NavController,
    private alertController: AlertController,
    private translate: TranslateService,
    private modalController: ModalController
  ) {}

  ionViewWillEnter() {
    this.checkProtocolInfo();
  }

  ngOnInit() {}

  async checkProtocolInfo() {
    if (!this.walletConnectService.peerMeta) {
      await this.walletConnectService.killSession();
      this.navController.pop();
    } else {
      this.peerMeta = this.walletConnectService.peerMeta;
      this.providerSymbol = this.walletConnectService.providerSymbol;
      this.transactionDetail = this.walletConnectService.requestInfo;
      this.checkRequestInfo(this.transactionDetail);
      this.getActualDateTime();
    }
  }

  getActualDateTime() {
    this.date = moment().utc().format('DD/MM/YYYY');
    this.time = moment().utc().format('HH:mm');
  }

  async getTotalAmount(estimatedGas, amount) {
    const gasPrice = await this.walletConnectService.getGasPrice();
    const gas = ethers.BigNumber.from(estimatedGas);
    this.totalFeeAmount = ethers.utils.formatEther(gasPrice.mul(gas).toString());

    if (amount) {
      this.totalAmount = ethers.utils.formatEther(ethers.BigNumber.from(amount));
    }
  }

  public async checkRequestInfo(request) {
    switch (request.method) {
      case 'eth_sendTransaction': {
        this.isSignRequest = false;
        this.isApproval = await this.walletConnectService.checkIsApproval(request);
        const gasLimit = !request.params[0].gas ? '70000' : request.params[0].gas;

        this.getTotalAmount(gasLimit, request.params[0].value);

        break;
      }
      case 'personal_sign': {
        try {
          this.message = ethers.utils.toUtf8String(request.params[0]);
        } catch (e) {
          this.message = request.params[0];
        }

        break;
      }
      case 'eth_sign': {
        try {
          this.message = ethers.utils.toUtf8String(request.params[1]);
        } catch (e) {
          this.message = request.params[1];
        }

        break;
      }
      case 'eth_signTypedData':
      case 'eth_signTypedData_v1':
      case 'eth_signTypedData_v3':
      case 'eth_signTypedData_v4': {
        const jsonData = JSON.parse(request.params[1]);
        delete jsonData.types;
        const finalRes = this.htmlFormatParse(jsonData);
        document.getElementById('message').appendChild(finalRes);

        break;
      }
      default:
        this.message = '';
    }
  }

  htmlFormatParse(obj, child = false) {
    let res;
    const html = document.createElement('div');

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] !== 'object') {
        res = this.createHtmlElement(child, key, obj[key]);
      } else {
        const title = this.createHtmlElement(child, key);
        const subContent = this.htmlFormatParse(obj[key], true);
        title.appendChild(subContent);
        res = title;
      }

      html.appendChild(res);
    });

    return html;
  }

  createHtmlElement(child, key, value = null) {
    const html = document.createElement('div');
    const title = document.createElement('span');

    if (child) {
      html.style.marginLeft = '16px';
    }

    title.style.fontWeight = '700';
    title.appendChild(document.createTextNode(key + ': '));
    html.appendChild(title);

    if (value) {
      const content = document.createElement('span');
      content.appendChild(document.createTextNode(value));
      html.appendChild(content);
    }

    return html;
  }

  public async cancelOperation() {
    const alert = await this.alertController.create({
      header: this.translate.instant('wallets.wallet_connect.operation_detail.cancel_alert.header'),
      message: this.translate.instant('wallets.wallet_connect.operation_detail.cancel_alert.message'),
      buttons: [
        {
          text: this.translate.instant('wallets.wallet_connect.operation_detail.cancel_alert.cancel_button'),
        },
        {
          text: this.translate.instant('wallets.wallet_connect.operation_detail.cancel_alert.accept_button'),
          handler: async () => {
            await this.walletConnectService.rejectRequest(this.transactionDetail.id);
            this.navController.pop();
          },
        },
      ],
    });
    await alert.present();
  }

  public async confirmOperation() {
    const modal = await this.modalController.create({
      component: WalletConnectSignRequestComponent,
      cssClass: 'recovery-phrase-password-modal ux-routeroutlet-modal',
      swipeToClose: false,
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data === true) {
      await this.walletConnectService.rejectRequest(this.transactionDetail.id);
    }

    if (data !== undefined) {
      this.navController.pop();
    }
  }
}
