import { Component, OnInit } from '@angular/core';
import { WalletConnectService } from '../../shared-wallets/services/wallet-connect/wallet-connect.service';
import { WalletEncryptionService } from '../../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { WalletPasswordComponent } from '../../../wallets/shared-wallets/components/wallet-password/wallet-password.component';
import { NavController } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ethers, Wallet } from 'ethers';
import * as moment from 'moment';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { EthersService } from '../../shared-wallets/services/ethers/ethers.service';

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
      <app-informative-card
        *ngIf="this.isSignRequest"
        [title]="'wallets.wallet_connect.operation_detail.card_title_sign'"
        [description]="'wallets.wallet_connect.operation_detail.card_description_sign'"
      ></app-informative-card>
      <app-informative-card
        *ngIf="!this.isSignRequest && !this.isApproval"
        [title]="'wallets.wallet_connect.operation_detail.card_title_operation'"
        [description]="'wallets.wallet_connect.operation_detail.card_description_operation'"
      ></app-informative-card>
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
            <div *ngIf="!this.isSignRequest">
              <app-default-request 
                [request]="this.transactionDetail" 
                [providerSymbol]="this.providerSymbol"
                [dateInfo]="this.dateInfo" 
                *ngIf="!this.decodedData"
              ></app-default-request>

              <app-swap-request 
                [request]="this.transactionDetail" 
                [providerSymbol]="this.providerSymbol" 
                [decodedData]="this.decodedData"
                [dateInfo]="this.dateInfo" 
                *ngIf="this.decodedData && this.decodedData.type === 'swap'"
              ></app-swap-request>

              <app-liquidity-request
                [request]="this.transactionDetail" 
                [providerSymbol]="this.providerSymbol" 
                [decodedData]="this.decodedData"
                [dateInfo]="this.dateInfo" 
                *ngIf="this.decodedData && this.decodedData.type === 'liquidity'"
              ></app-liquidity-request>

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

            <app-sign-request 
              [message]="this.message"
              [dateInfo]="this.dateInfo" 
              *ngIf="this.isSignRequest"
            ></app-sign-request>
          </div>

          <div class="wcod__button_section">
            <ion-button
              [appLoading]="this.loading"
              [loadingText]=" this.loadingText | translate"
              class="ux_button"
              appTrackClick
              name="Next"
              color="uxsecondary"
              size="large"
              (click)="confirmOperation()"
              [disabled]="this.disable"
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
          </div>
        </div>

        <div class="disconnect_link">
          <a (click)="this.cancelOperation()">{{ 'wallets.wallet_connect.operation_detail.cancel_button' | translate }}</a>
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
  public decodedData:any  = null;
  public transactionConfirmed = false;
  public transactionDetail;
  public message: any;
  public dateInfo = {
    date: null,
    time: null
  };
  public totalFeeAmount;
  public providerSymbol = '';
  loading = false;
  disable = false;
  loadingText = '';

  constructor(
    private walletConnectService: WalletConnectService,
    private navController: NavController,
    private alertController: AlertController,
    private translate: TranslateService,
    private modalController: ModalController,
    private walletEncryptionService: WalletEncryptionService,
    private toastService: ToastService,
    private ethersService: EthersService
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
    this.dateInfo.date = moment().utc().format('DD/MM/YYYY');
    this.dateInfo.time = moment().utc().format('HH:mm');
  }

  async getTotalFeeAmount(estimatedGas) {
    const gasPrice = await this.walletConnectService.getGasPrice();
    const gas = ethers.BigNumber.from(estimatedGas);
    this.totalFeeAmount = ethers.utils.formatEther(gasPrice.mul(gas).toString());
  }

  public async checkRequestInfo(request) {
    switch (request.method) {
      case 'eth_signTransaction':
      case 'eth_sendTransaction': {
        this.isSignRequest = false;
        this.decodedData = await this.walletConnectService.getTransactionType(request);
        this.isApproval = this.decodedData && this.decodedData.name === 'approve';
        const gasLimit = !request.params[0].gas ? '70000' : request.params[0].gas;

        this.getTotalFeeAmount(gasLimit);

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

  setLoadingText() {
    console.log(this.isSignRequest)
    if (this.isSignRequest) this.loadingText = 'wallets.wallet_connect.operation_detail.sign_loading';
    else if (this.isApproval) this.loadingText = 'wallets.wallet_connect.operation_detail.approve_loading';
    else this.loadingText = 'wallets.wallet_connect.operation_detail.confirmation_loading';

    console.log(this.loadingText)
  }

  public async confirmOperation() {
    this.setLoadingText();

    const password = await this.requestPassword();

    if (password) {
      this.loadingEnabled(true);
      let wallet = await this.decryptedWallet(password);

      if (wallet) {
        const provider = this.ethersService.newProvider(this.walletConnectService.rpcUrl);
        wallet = wallet.connect(provider);
        const res = await this.walletConnectService.checkRequest(this.walletConnectService.requestInfo, wallet);

        this.loadingEnabled(false);
        if (!!res.error && res.error === true) {
          this.showAlertTxError();
        } else {
          this.navController.pop();
        }
      }
    }
  }

  async decryptedWallet(password: string): Promise<Wallet> {
    try {
      return await this.walletEncryptionService.getDecryptedWalletForNetwork(password, this.walletConnectService.network)
    } catch (error) {
      this.loadingEnabled(false);
      await this.toastService.showErrorToast({
        message: this.translate.instant('wallets.wallet_connect.operation_detail.password_error'),
      });
    }
  }

  async requestPassword(): Promise<any> {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      componentProps: {
        title: this.translate.instant('wallets.wallet_connect.operation_detail.password_modal.title'),
        description: this.translate.instant('wallets.wallet_connect.operation_detail.password_modal.description'),
        inputLabel: this.translate.instant('wallets.wallet_connect.operation_detail.password_modal.input_label'),
        submitButtonText: this.translate.instant('wallets.wallet_connect.operation_detail.password_modal.confirm_button'),
        disclaimer: '',
      },
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      backdropDismiss: false
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    return data;
  }

  private async showAlertTxError() {
    const alert = await this.alertController.create({
      header: this.translate.instant('wallets.wallet_connect.transactions.alert.header'),
      message: this.translate.instant('wallets.wallet_connect.transactions.alert.message'),
      cssClass: 'ux-wallet-error-alert ux-alert',
      buttons: [
        {
          text: this.translate.instant('wallets.wallet_connect.transactions.alert.accept_button'),
          handler: async () => {
            this.modalController.dismiss(true);
          },
        },
      ],
    });
    await alert.present();
  }

  private loadingEnabled(enabled: boolean) {
    this.loading = enabled;
  }
}
