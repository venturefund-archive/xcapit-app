import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavController } from '@ionic/angular';
import { TwoButtonsAlertComponent } from 'src/app/shared/components/two-buttons-alert/two-buttons-alert.component';
import { LanguageService } from '../../../shared/services/language/language.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BitrefillOperation } from '../shared-ramps/interfaces/bitrefill-operation.interface';
import { RawBitrefillOperation } from '../shared-ramps/interfaces/raw-bitrefill-operation.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { WalletPasswordComponent } from '../../wallets/shared-wallets/components/wallet-password/wallet-password.component';
import { Password } from '../../swaps/shared-swaps/models/password/password';
import { LoginToken } from '../../users/shared-users/models/login-token/login-token';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WalletTransactionsService } from '../../wallets/shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { PasswordErrorMsgs } from '../../swaps/shared-swaps/models/password/password-error-msgs';
import { formatUnits } from 'ethers/lib/utils';
@Component({
  selector: 'app-bitrefill',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left">
        <ion-title>
          {{ 'fiat_ramps.bitrefill.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button name="goBack" (click)="this.navigateBack()">{{
            'fiat_ramps.bitrefill.exit_button' | translate
          }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <iframe
        *ngIf="this.url !== undefined"
        [src]="this.url"
        frameborder="0"
        scrolling="yes"
        width="100%"
        height="100%"
      ></iframe>
    </ion-content>
  `,
  styleUrls: ['./bitrefill.page.scss'],
})
export class BitrefillPage {
  rootURL = 'https://www.bitrefill.com/embed/';
  url: SafeResourceUrl;
  data: BitrefillOperation;
  rawData: RawBitrefillOperation;
  availablePaymentMethods = ['usdc_polygon', 'ethereum', 'usdt_erc20', 'usdc_erc20'];
  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private navController: NavController,
    private languageService: LanguageService,
    private sanitizer: DomSanitizer,
    private apiWalletService: ApiWalletService,
    private storage: IonicStorageService,
    private walletTransactionsService: WalletTransactionsService
  ) {}

  ionViewWillEnter() {
    this.setURL();
    this.addListener();
  }

  async navigateBack() {
    const modal = await this.modalController.create({
      component: TwoButtonsAlertComponent,
      cssClass: 'modal',
      backdropDismiss: false,
      componentProps: {
        title: this.translate.instant('fiat_ramps.bitrefill.modal.title'),
        description: this.translate.instant('fiat_ramps.bitrefill.modal.description'),
        confirmButton: this.translate.instant('fiat_ramps.bitrefill.modal.confirm_button'),
        cancelButton: this.translate.instant('fiat_ramps.bitrefill.modal.cancel_button'),
      },
    });

    await modal.present();
    const { role } = await modal.onDidDismiss();
    if (role === 'confirm') {
      await this.navController.navigateBack('/tabs/wallets');
    }
  }

  async setURL() {
    const languageCode = await this.languageService.getSelectedLanguage();
    const rawURL = `${this.rootURL}?hl=${languageCode}`;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(rawURL);
  }

  addListener() {
    window.addEventListener(
      'message',
      async (event) => {
        this.rawData = JSON.parse(event.data);
        if (this.rawData.event === 'payment_intent') {
          this.data = this.dataOf();
          await this.handleSubmit();
          console.log('DATA', this.data);
        }
      },
      false
    );
  }

  dataOf(): BitrefillOperation {
    return this.rawData.paymentUri.includes('transfer?address=')
      ? this.nonNativeOperationDataOf()
      : this.nativeOperationDataOf();
  }

  nativeOperationDataOf(): BitrefillOperation {
    console.log('native');
    const blockchainAndAddress = this.rawData.paymentUri.split('?')[0];
    const extraParams = new URLSearchParams(this.rawData.paymentUri.split('?')[1]);
    const addressWithChainId = blockchainAndAddress.split(':')[1];
    const address = addressWithChainId.split('@')[0];
    const chainId = parseFloat(addressWithChainId.split('@')[1]);
    // const token = this.apiWalletService.getCoins().find((coin: Coin) => {
    //   return coin.chainId === chainId && coin.native;
    // });
    const token = this.apiWalletService.getCoin('ETH', 'ERC20'); //TODO: Borrar esto, solo esta a modo de prueba
    const weiAmount = parseFloat(extraParams.get('value'));
    const amount = parseFloat(formatUnits(weiAmount, token.decimals));
    return {
      address,
      weiAmount,
      amount,
      token,
    };
  }

  nonNativeOperationDataOf(): BitrefillOperation {
    console.log('non native');
    const blockchainAndTokenContract = this.rawData.paymentUri.split('?')[0].split('/')[0];
    const extraParams = new URLSearchParams(this.rawData.paymentUri.split('?')[1]);
    const addressWithChainId = blockchainAndTokenContract.split(':')[1];
    const tokenContract = addressWithChainId.split('@')[0];
    const address = extraParams.get('address');
    const chainId = parseFloat(blockchainAndTokenContract.split('@')[1]);
    // const token = this.apiWalletService
    //   .getCoins()
    //   .find((coin: Coin) => coin.chainId === chainId && coin.contract === tokenContract);
    const token = this.apiWalletService.getCoin('USDC', 'MATIC'); //TODO: Borrar esto, solo esta a modo de prueba
    const weiAmount = parseFloat(extraParams.get('uint256'));
    const amount = parseFloat(formatUnits(weiAmount, token.decimals));
    return {
      address,
      amount,
      weiAmount,
      token,
    };
  }

  async askForPassword() {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      componentProps: {
        state: 'send',
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    const password = new Password(data);
    if (await this.validPassword(password)) {
      return password;
    } else {
      throw new Error(new PasswordErrorMsgs().invalid());
    }
  }

  async handleSubmit() {
    console.log('submit');
    if (!(await this.checksBeforeSend())) {
      return;
    }
    console.log('pass checksBeforeSend');

    try {
      const password = await this.askForPassword();
      if (!password) {
        return;
      }
      await this.send(password.value());
    } catch (error) {
      await this.handleSendError(error);
    }
  }

  private async checksBeforeSend(): Promise<boolean> {
    console.log('checksBeforeSend', this.data);
    if (!(await this.userCanAffordFees())) {
      // await this.handleUserCantAffordFees();
      return false;
    }
    console.log('can afford fees');

    if (!(await this.userCanAffordTx())) {
      // await this.handleUserCantAffordTx();
      return false;
    }
    console.log('can afford tx');

    return true;
  }

  private async handleSendError(error) {
    // if (new PasswordErrorMsgs().isInvalidError(error)) {
    //   await this.handleInvalidPassword();
    // } else if (this.isNotEnoughBalanceError(error)) {
    //   await this.handleNotEnoughBalance();
    // } else if (!new PasswordErrorMsgs().isEmptyError(error)) {
    //   throw error;
    // }
  }

  private userCanAffordFees(): Promise<boolean> {
    return this.walletTransactionsService.canAffordSendFee(this.data.address, this.data.amount, this.data.token);
  }

  private userCanAffordTx(): Promise<boolean> {
    return this.walletTransactionsService.canAffordSendTx(this.data.address, this.data.amount, this.data.token);
  }

  private async send(password: string) {
    // const response = await this.walletTransactionsService.send(
    //   password,
    //   this.data.amount,
    //   this.data.address,
    //   this.data.token
    // );
    // this.notifyWhenTransactionMined(response);
    console.log('contraseña correcta', password, this.data);
  }

  // private notifyWhenTransactionMined(response?: TransactionResponse) {
  //   response
  //     .wait()
  //     .then(() => this.showSuccessToast())
  //     .catch((err) => this.showErrorToast(err));
  // }

  private showSuccessToast() {}

  private showErrorToast(err) {}

  private validPassword(password: Password) {
    return new LoginToken(password, this.storage).valid();
  }

  ionViewWillLeave() {
    window.removeAllListeners();
  }
}
