import { Injectable } from '@angular/core';
import WalletConnect from '@walletconnect/client';
import { WalletTransactionsService } from '../../services/wallet-transactions/wallet-transactions.service';
import { ethers } from 'ethers';
import * as AbiDecoder from 'abi-decoder';
import erc20Abi from '../../constants/assets-abi/erc20-abi.json';
import routerAbi from '../../constants/assets-abi/exchange-abi.json';
import factoryAbi from '../../constants/assets-abi/factory-abi.json';
import pairAbi from '../../constants/assets-abi/pair-abi.json';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { transactionType } from '../../constants/transaction-type';

@Injectable({
  providedIn: 'root',
})
export class WalletConnectService {
  public walletConnector: WalletConnect | null = null;
  uri = '';
  peerMeta: {
    description: string;
    url: string;
    icons: string[];
    name: string;
    ssl?: boolean;
  };
  requestInfo: any;
  providerSymbol = '';
  rpcUrl = '';
  network = '';
  public requests: any[] = [];
  connected = false;
  public address: string;
  public activeChainId = 1;
  public walletId: string;
  public supportedMethods: string[] = [
    'eth_sendTransaction',
    'eth_sign',
    'eth_signTransaction',
    'eth_signTypedData',
    'eth_signTypedData_v1',
    'eth_signTypedData_v3',
    'eth_signTypedData_v4',
    'personal_sign',
  ];
  public contractsAbi;
  public isApproveRequest = false;
  public transactionTypes;

  constructor(
    private walletTransactionsService: WalletTransactionsService,
    private appStorageService: AppStorageService,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.contractsAbi = AbiDecoder;
    this.contractsAbi.addABI(erc20Abi);
    this.contractsAbi.addABI(routerAbi);
    this.transactionTypes = transactionType;
  }

  async onInit() {}

  public setUri(uri) {
    this.uri = uri;
  }

  public async checkConnection() {
    if (this.walletConnector) {
      const isConnected = await this.ping();
      if (isConnected) return;
    }
    
    await this.appStorageService.remove('walletconnect');
  }

  public async ping() {
    return new Promise((resolve) => {
      try {
        this.walletConnector.approveSession({
          chainId: this.activeChainId,
          accounts: [this.address],
        });
      } catch (error) {
        resolve(error);
      }
    });
  }

  public async initWalletConnect(uri): Promise<void> {
    this.walletConnector = new WalletConnect({
      uri,
    });

    if (!this.walletConnector.connected) {
      await this.walletConnector.createSession();
    }

    await this.subscribeToEvents();
  }

  public checkDappStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      let retry = 0;
      const interval = setInterval(async () => {
        if (this.peerMeta) {
          clearInterval(interval);
          return resolve(true);
        }

        retry++;

        if (retry >= 15) {
          clearInterval(interval);
          const error = 'Dapp not responding. Try scanning a new QR code';
          if (this.walletConnector && this.walletConnector.session) await this.killSession();

          return reject(error);
        }
      }, 1000);
    });
  }

  public async setAccountInfo(wallet) {
    if (wallet) {
      this.address = wallet.address;
      this.activeChainId = wallet.chainId;
      this.providerSymbol = wallet.symbol;
      this.rpcUrl = wallet.rpc;
      this.network = wallet.network;
    }
  }

  public async approveSession(): Promise<void> {
    if (this.walletConnector) {
      const l = await this.walletConnector.approveSession({
        chainId: this.activeChainId,
        accounts: [this.address],
      });

      window.addEventListener('beforeunload', async () => {
        await this.killSession();
      });

    } else {
      throw new Error();
    }
  }

  public async subscribeToEvents() {
    if (!this.walletConnector) return;
    this.walletConnector.on('session_request', (error, payload) => {
      if (error) {
        throw error;
      }

      this.peerMeta = payload.params[0].peerMeta;
    });

    this.walletConnector.on('session_update', (error, payload) => {
      if (error) {
        throw error;
      }
    });

    this.walletConnector.on('call_request', async (error, payload) => {
      if (error) {
        throw error;
      }

      this.requestInfo = payload;

      this.navController.navigateForward(['wallets/wallet-connect/operation-detail']);
    });

    this.walletConnector.on('connect', async (error, payload) => {
      if (error) {
        throw error;
      }

      this.connected = true;
    });

    this.walletConnector.on('disconnect', async (error, payload) => {
      if (error) {
        throw error;
      }

      await this.checkActiveScreen();
    });
  }

  public async checkActiveScreen() {
    const url = this.router.url.split('/').pop();
    
    if (url === 'connection-detail') {
      this.navController.navigateBack(['wallets/wallet-connect/new-connection']);
    }
    
    const dapp = this.peerMeta.name
    await this.killSession();
    this.showDisconnectionToast(this.translate.instant('wallets.wallet_connect.dapp_disconnection.message', {dapp}))
  }

  private showDisconnectionToast(text: string) {
    this.toastService.showErrorToast({
      message: this.translate.instant(text),
    });
  }

  public async killSession(): Promise<void> {
    if (this.walletConnector) {
      ['session_request', 'session_update', 'call_request', 'connect', 'disconnect'].forEach((event) =>
        this.walletConnector.off(event)
      );

      this.walletConnector.off('disconnect');

      this.peerMeta = null;
      this.connected = false;
      
      if (this.walletConnector.session.connected) {
        await this.walletConnector.killSession();
      }

      this.walletConnector = null;
    }
  }

  public async approveRequest(id, result): Promise<void> {
    if (this.walletConnector) {
      const res = await this.walletConnector.approveRequest({
        id,
        result,
      });
    }
  }

  public async rejectRequest(requestId): Promise<void> {
    if (this.walletConnector) {
      this.walletConnector.rejectRequest({
        id: requestId,
        error: { message: 'Failed or Rejected Request' },
      });
    }
  }

  public async getTransactionType(request) {
    const decodedData = this.contractsAbi.decodeMethod(request.params[0].data);

    if (decodedData && decodedData.name) {
      const type = this.transactionTypes.filter((type) => type.name === decodedData.name)[0];
      if (type) {
        type.data = decodedData.params

        return type;
      }
    }

    return null;
  }

  public async checkIsApproval(request) {
    const decodedData = this.contractsAbi.decodeMethod(request.params[0].data);
    this.isApproveRequest = request && decodedData?.name === 'approve';

    return this.isApproveRequest;
  }

  public async getGasPrice() {
    const provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);

    return await provider.getGasPrice();
  }

  public async getTokenSymbol(token) {
    const provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
    const contract = new ethers.Contract(token, erc20Abi, provider);

    return await contract.symbol();
  }

  public async getPairTokens(routerAddress, token0, token1 = null) {
    const symbols = [];

    const provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
    const routerContract = new ethers.Contract(routerAddress, routerAbi, provider);
    const wethAddress = await routerContract.WETH();
    
    if (token1 === null) {
      token1 = wethAddress;
    }

    const factoryAddress = await routerContract.factory();

    const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, provider);
    const pairAddress = await factoryContract.getPair(token0, token1);

    const pairContract = new ethers.Contract(pairAddress, pairAbi, provider);

    const pairToken0 = await pairContract.token0();
    const pairToken1 = await pairContract.token1();

    symbols[0] = pairToken0 === wethAddress ? this.providerSymbol : await this.getTokenSymbol(pairToken0);
    symbols[1] = pairToken1 === wethAddress ? this.providerSymbol : await this.getTokenSymbol(pairToken1);

    return symbols;
  }

  public async checkRequest(request, userWallet) {
    if (request) {
      let addressRequested;
      const address = this.address;
      const wallet = userWallet;
      const peerMeta = this.peerMeta;
      const gasPrice = await this.getGasPrice();

      switch (request.method) {
        case 'eth_signTransaction':
        case 'eth_sendTransaction':
          addressRequested = request.params[0].from;

          if (address.toLowerCase() === addressRequested.toLowerCase()) {
            const gasLim = request.params[0].gas ? request.params[0].gas : '70000';

            const data = {
              from: request.params[0].from,
              data: request.params[0].data,
              to: request.params[0].to,
              gasLimit: gasLim,
              gasPrice,
            };

            if(request.params[0].value && request.params[0].value > 0) {
              data["value"] = request.params[0].value;
            }

            try {
              const result = await this.walletTransactionsService.sendRawTransaction(wallet, data);
              await this.approveRequest(request.id, result.hash);

              return { error: false };
            } catch (error) {
              return { error: true };
            }
          } else {
            console.log('Error: Address requested does not match active account');
          }
          break;
        case 'eth_signTypedData':
        case 'eth_signTypedData_v1':
        case 'eth_signTypedData_v3':
        case 'eth_signTypedData_v4':
          addressRequested = request.params[0];

          if (address.toLowerCase() === addressRequested.toLowerCase()) {
            try {
              const result = await this.walletTransactionsService.signTypedData(wallet, request.params[1]);
              await this.approveRequest(request.id, result);

              return { error: false };
            } catch (error) {
              return { error: true };
            }
          } else {
            console.log('Error: Address requested does not match active account');
          }
          break;
        case 'personal_sign':
          addressRequested = request.params[1];

          if (address.toLowerCase() === addressRequested.toLowerCase()) {
            try {
              const result = await this.walletTransactionsService.personalSign(wallet, request.params[0]);
              await this.approveRequest(request.id, result);

              return { error: false };
            } catch (error) {
              return { error: true };
            }
          } else {
            console.log('Error: Address requested does not match active account');
          }
          break;
        case 'eth_sign':
          addressRequested = request.params[0];

          if (address.toLowerCase() === addressRequested.toLowerCase()) {
            try {
              const result = await this.walletTransactionsService.personalSign(wallet, request.params[1]);
              await this.approveRequest(request.id, result);

              return { error: false };
            } catch (error) {
              return { error: true };
            }
          } else {
            console.log('Error: Address requested does not match active account');
          }
          break;
        default:
          console.log(`Not supported method: ${request.method}`);
      }
    }
  }
}
