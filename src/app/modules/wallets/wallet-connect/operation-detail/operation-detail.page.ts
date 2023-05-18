import { Component } from '@angular/core';
import { WalletConnectService } from '../../shared-wallets/services/wallet-connect/wallet-connect.service';
import { WalletEncryptionService } from '../../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { WalletPasswordComponent } from '../../shared-wallets/components/wallet-password/wallet-password.component';
import { NavController } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ethers, Wallet } from 'ethers';
import * as moment from 'moment';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { EthersService } from '../../shared-wallets/services/ethers/ethers.service';
import { SessionRequestInjectable } from 'src/app/shared/models/wallet-connect/wallet-connect-request/injectable/session-request-injectable';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { WCConnectionV2 } from '../../shared-wallets/services/wallet-connect/wc-connection-v2/wc-connection-v2';
import { WCService } from '../../shared-wallets/services/wallet-connect/wc-service/wc.service';
import { HtmlOf } from '../../../../shared/models/wallet-connect/html-of/html-of';
import { HtmlContentOf } from 'src/app/shared/models/wallet-connect/html-content-of/html-content-of';

@Component({
  selector: 'app-operation-detail',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
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
                  <ion-label> {{ this.totalFeeAmount | formattedAmount }} {{ this.providerSymbol }} </ion-label>
                </div>
              </div>
            </div>

            <app-sign-request
              [message]="this.message"
              [dateInfo]="this.dateInfo"
              *ngIf="this.isSignRequest && this.message !== undefined"
            ></app-sign-request>
          </div>

          <div class="wcod__button_section">
            <ion-button
              [appLoading]="this.loading"
              [loadingText]="this.loadingText | translate"
              class="ux_button"
              appTrackClick
              [dataToTrack]="{ eventLabel: this.dataToTrackButton }"
              color="secondary"
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

        <div class="disconnect_link" *ngIf="!this.loading">
          <a (click)="this.cancelOperation()">{{
            'wallets.wallet_connect.operation_detail.cancel_button' | translate
          }}</a>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./operation-detail.page.scss'],
})
export class OperationDetailPage {
  public peerMeta;
  public isSignRequest = true;
  public isApproval = false;
  public decodedData: any = null;
  public transactionDetail;
  public message: HTMLElement;
  public dateInfo = {
    date: null,
    time: null,
  };
  public totalFeeAmount;
  public providerSymbol = '';
  loading = false;
  disable = false;
  loadingText = '';
  dataToTrackButton: string;
  constructor(
    private walletConnectService: WalletConnectService,
    private navController: NavController,
    private alertController: AlertController,
    private translate: TranslateService,
    private modalController: ModalController,
    private walletEncryptionService: WalletEncryptionService,
    private toastService: ToastService,
    private ethersService: EthersService,
    private wcService: WCService,
    private sessionRequestInjectable: SessionRequestInjectable,
    private wcConnectionV2: WCConnectionV2
  ) {}

  ionViewWillEnter() {
    this.checkConnection();
    this.dataToTrackButton = this.dataToTrack();
  }

  async checkConnection() {
    if (this.wcService.connected()) {
      await this.setTemplateData();
      this.getActualDateTime();
    } else {
      if (!this.wcService.uri().isV2() && !this.walletConnectService.peerMeta) {
        await this.walletConnectService.killSession();
      }
      this.navController.pop();
    }
  }

  async setTemplateData() {
    this.wcService.uri().isV2() ? this.setTemplateDataFromRequest() : await this.checkProtocolInfo();
  }

  async setTemplateDataFromRequest() {
    const sessionRequest = this.sessionRequestInjectable.request();
    const session = this.wcConnectionV2.session();
    const requestData = sessionRequest.data();

    this.peerMeta = session.peerMetadata();
    this.providerSymbol = session.wallet().blockchain().nativeToken().symbol();

    this.transactionDetail = sessionRequest.request();

    this.message = requestData.message().value();
    this.isSignRequest = requestData.isSignRequest();
    this.decodedData = requestData.decodedData();
    this.isApproval = requestData.isApproval();
    this.totalFeeAmount = requestData.fee();
  }

  async checkProtocolInfo() {
    this.peerMeta = this.walletConnectService.peerMeta;
    this.providerSymbol = this.walletConnectService.providerSymbol;
    this.transactionDetail = this.walletConnectService.requestInfo;
    this.checkRequestInfoV1(this.transactionDetail);
  }

  getActualDateTime() {
    this.dateInfo.date = moment().format('DD/MM/YYYY');
    this.dateInfo.time = moment().format('HH:mm');
  }

  dataToTrack() {
    if (this.isSignRequest) return 'ux_wc_sign';
    if (this.isApproval) return 'ux_wc_approve';
    return 'ux_wc_confirm';
  }

  async getTotalFeeAmount(estimatedGas) {
    const gasPrice = await this.walletConnectService.getGasPrice();
    const gas = ethers.BigNumber.from(estimatedGas);
    this.totalFeeAmount = parseFloat(ethers.utils.formatEther(gasPrice.mul(gas).toString()));
  }

  public async checkRequestInfoV1(request) {
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
      case 'personal_sign':
        this._setSignMessageOf(request.params[0]);
        break;
      case 'eth_sign': {
        this._setSignMessageOf(request.params[1]);
        break;
      }
      case 'eth_signTypedData':
      case 'eth_signTypedData_v1':
      case 'eth_signTypedData_v3':
      case 'eth_signTypedData_v4': {
        const jsonParams = JSON.parse(request.params[1]);
        delete jsonParams.types;
        this.message = new HtmlContentOf(jsonParams).value();
        break;
      }
    }
  }

  private _setSignMessageOf(aParam: string) {
    let text = aParam;
    try {
      text = ethers.utils.toUtf8String(aParam);
    } finally {
      this.message = new HtmlOf(text).value();
    }
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
            await this.rejectRequest();
          },
        },
      ],
    });
    await alert.present();
  }

  private async rejectRequest() {
    if (this.wcService.uri().isV2()) {
      await this.sessionRequestInjectable.request().reject();
    } else {
      await this.walletConnectService.rejectRequest(this.transactionDetail.id);
    }
    this.navController.pop();
  }

  setLoadingText() {
    if (this.isSignRequest) this.loadingText = 'wallets.wallet_connect.operation_detail.sign_loading';
    else if (this.isApproval) this.loadingText = 'wallets.wallet_connect.operation_detail.approve_loading';
    else this.loadingText = 'wallets.wallet_connect.operation_detail.confirmation_loading';
  }
  public async confirmOperation() {
    this.setLoadingText();
    const password = await this.requestPassword();
    if (password) {
      this.loadingEnabled(true);
      this.wcService.uri().isV2() ? this.confirmOperationV2(password) : this.confirmOperationV1(password);
    }
  }

  private async confirmOperationV2(password: string) {
    this.wcConnectionV2
      .session()
      .wallet()
      .onNeedPass()
      .subscribe(() => new Password(password).value());
    try {
      await this.sessionRequestInjectable.request().approve();
      this.navController.pop();
    } catch (err) {
      this.loadingEnabled(false);
      this.showAlertTxError();
    }
  }

  private async confirmOperationV1(password: string) {
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

  async decryptedWallet(password: string): Promise<Wallet> {
    try {
      return await this.walletEncryptionService.getDecryptedWalletForNetwork(
        password,
        this.walletConnectService.network
      );
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
        submitButtonText: this.translate.instant(
          'wallets.wallet_connect.operation_detail.password_modal.confirm_button'
        ),
        disclaimer: '',
      },
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      backdropDismiss: false,
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
