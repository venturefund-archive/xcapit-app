import { Injectable } from '@angular/core';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { Coin } from '../../interfaces/coin.interface';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from '../../../../../../environments/environment';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CovalentQuoteCurrency } from '../../types/covalent-quote-currencies.type';
import { CovalentTransfersResponse } from '../../models/covalent-transfers-response/covalent-transfers-response';
import { BigNumber, Wallet } from 'ethers';
import { personalSign, signTypedData_v4 } from 'eth-sig-util';
import { TokenSend } from '../../models/token-send/token-send.model';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { ERC20Token } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-token/erc20-token.model';
import { ERC20Contract } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';

@Injectable({
  providedIn: 'root',
})
export class WalletTransactionsService {
  tokenSendClass = TokenSend;
  erc20ProviderClass = ERC20Provider;
  erc20TokenClass = ERC20Token;
  
  authHeaders = { Authorization: `Basic ${btoa(environment.covalentApiKey + ':')}` };

  constructor(
    private walletEncryptionService: WalletEncryptionService,
    private storageService: StorageService,
    private http: CustomHttpService,
    private apiWalletService: ApiWalletService,
  ) {}

  async send(password: string, amount: string, to: string, coin: Coin): Promise<string | TransactionResponse> {
    const from = await this.storageService.getWalletsAddresses(coin.network);
    let wallet = await this.walletEncryptionService.getDecryptedWalletForCurrency(password, coin);
    const tx = this.tokenSendClass.create(from, to, amount, coin, this.apiWalletService, wallet);
    return tx.send();
  }

  async sendRawTransaction(wallet: Wallet, rawData): Promise<any> {
    const nonce = await wallet.getTransactionCount();
    rawData.nonce = nonce;
    const transactionResponse = await wallet.sendTransaction(rawData);
    await transactionResponse.wait();

    return transactionResponse;
  }

  async signTypedData(wallet: Wallet, dataToSign: any) {
    const privKey = wallet.privateKey.replace('0x', '');

    const result = signTypedData_v4(Buffer.from(privKey.toString(), 'hex'), { data: JSON.parse(dataToSign) });

    return result;
  }

  async personalSign(wallet: Wallet, dataToSign: any) {
    const privKey = wallet.privateKey.replace('0x', '');
    const result = personalSign(Buffer.from(privKey.toString(), 'hex'), { data: dataToSign });

    return result;
  }

  async getAllTransactions(asset: string = null): Promise<any> {
    return new Promise<any>(async (resolve) => {
      const addresses = await this.storageService.getWalletsAddresses();

      /*
       * El método "alchemy_getAssetTransfers" sólo funciona en mainnet
       * Se agrega urlProvider de mainnet y datos de prueba para testing
       */

      const urlProvider = 'https://eth-mainnet.alchemyapi.io/v2/-6TB-QpsZnR6WfJJjO3u6BZhGINLDgFH';
      // test mainnet address 0x9cBb2b28dF12A6f520Cfd4a97b8C89f89EE10C59 / 0x39F65f7F9418a35b5A8d07f08Ac9484b03d46295

      this.getTransactions(addresses.ETH_TEST, urlProvider).subscribe((response) => {
        if (asset) {
          response = response.filter((tx) => tx.asset === asset);
        }

        resolve(response);
      });
    });
  }

  getLastTransaction(): Promise<any> {
    return new Promise<any>(async (resolve) => {
      const addresses = await this.storageService.getWalletsAddresses();

      /*
       * El método "alchemy_getAssetTransfers" sólo funciona en mainnet
       * Se agrega urlProvider de mainnet y datos de prueba para testing
       */

      const urlProvider = 'https://eth-mainnet.alchemyapi.io/v2/-6TB-QpsZnR6WfJJjO3u6BZhGINLDgFH';

      this.getTransactions(addresses.ETH_TEST, urlProvider).subscribe((response) => {
        const lastTx = [];

        if (response.length > 0) {
          lastTx.push(response[0]);
        }

        resolve(lastTx);
      });
    });
  }

  getTransactions(address, urlProvider): Observable<any> {
    const bodyReceived = this.getBodyStructure('toAddress', address);
    const bodySended = this.getBodyStructure('fromAddress', address);

    return forkJoin([this.http.post(urlProvider, bodyReceived), this.http.post(urlProvider, bodySended)]).pipe(
      map((response) => {
        const received = this.mapResponse(response[0].result.transfers, 'received');
        const sended = this.mapResponse(response[1].result.transfers, 'sended');

        return this.mergeTransactions(received, sended);
      })
    );
  }

  getBodyStructure(type, address) {
    const body = {
      jsonrpc: '2.0',
      id: 2,
      method: 'alchemy_getAssetTransfers',
      params: [
        {
          fromBlock: '0x0000000',
          toBlock: 'latest',
          excludeZeroValue: true,
          category: ['external', 'token'],
        },
      ],
    };

    body.params[0][type] = address;

    return body;
  }

  mapResponse(response, action) {
    const res = [];

    for (const tx of response) {
      if (tx.asset) {
        const txRes = {
          icon:
            action === 'received'
              ? 'assets/img/wallet-transactions/received.svg'
              : 'assets/img/wallet-transactions/sended.svg',
          type: action,
          asset: tx.asset,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          hash: tx.hash,
          blockNumber: tx.blockNum,
          erc721: tx.erc721TokenId,
          rawContract: !!tx.rawContract.address,
          swap: {
            currencyIn: '',
            currencyOut: '',
            amountIn: null,
            amountOut: null,
          },
        };

        res.push(txRes);
      }
    }

    return res;
  }

  mergeTransactions(received, sended) {
    const txs = [];

    for (const rec of received) {
      const swap = sended.filter((send) => send.hash === rec.hash);

      if (swap.length === 0) {
        txs.push(rec);
      } else if (swap.length === 1) {
        rec.icon = 'assets/img/wallet-transactions/swap.svg';
        rec.type = 'swap';
        rec.swap = {
          currencyIn: rec.asset,
          currencyOut: swap[0].asset,
          amountIn: rec.value,
          amountOut: swap[0].value,
        };

        txs.push(rec);
        sended = sended.filter((send) => send.hash !== rec.hash);
      } else {
        for (const s of swap) {
          txs.push(s);
          sended = sended.filter((send) => send.hash !== s.hash);
        }
        txs.push(rec);
      }
    }
    const totalTxs = [...txs, ...sended];

    const ordered = totalTxs.sort((a, b) => {
      return parseInt(a.blockNumber, 16) - parseInt(b.blockNumber, 16);
    });

    return ordered.reverse();
  }

  private getUrl(asset: Coin, address: string, quoteCurrency: CovalentQuoteCurrency): string {
    return asset.contract
      ? `${environment.covalentApiUrl}${asset.chainId}/address/${address}/transfers_v2/?contract-address=${asset.contract}&limit=10&quote-currency=${quoteCurrency}`
      : `${environment.covalentApiUrl}${asset.chainId}/address/${address}/transactions_v2/?no-logs=true&match={"value":{"$ne": "0"}}&limit=10&quote-currency=${quoteCurrency}`;
  }

  getTransfers(
    address: string,
    asset: Coin,
    quoteCurrency: CovalentQuoteCurrency = 'USD'
  ): Observable<CovalentTransfersResponse> {
    return this.http
      .get(this.getUrl(asset, address, quoteCurrency), { headers: this.authHeaders })
      .pipe(map((res) => new CovalentTransfersResponse(res, asset)));
  }

  async canAffordSendTx(from: string, to: string, amount: string, coin: Coin): Promise<boolean> {
    const fee = this.sendEstimatedFee(from, to, amount, coin);
    const balanceNativeCoin = this.balanceOfNativeCoin(from, coin);
    const balanceNotNativeCoin = this.balanceOfNotNativeCoin(from, coin);

    return Promise.all([fee, balanceNativeCoin, balanceNotNativeCoin])
      .then((values) => {
        const totalNativeCoin = coin.native ? parseEther(values[0]).add(parseEther(amount)) : parseEther(values[0]);
        const totalNotNativeCoin = coin.native ? 0 : parseUnits(amount, coin.decimals);
        const balanceNativeCoin = values[1];
        const balanceNotNativeCoin = values[2];

        if (balanceNativeCoin.gte(totalNativeCoin) && balanceNotNativeCoin.gte(totalNotNativeCoin)) {
          return true;
        } else {
          return false;
        }
      })
      .catch(() => false);
  }

  async sendEstimatedFee(from: string, to: string, amount: string, coin: Coin): Promise<string> {
    const txWithVoidSigner = this.tokenSendClass.create(from, to, amount, coin, this.apiWalletService);
    await txWithVoidSigner.sendEstimateFee();
    return txWithVoidSigner.formatFee();
  }

  private balanceOfNativeCoin(address: string, coin: Coin): Promise<BigNumber> {
    const nativeCoin = coin.native ? coin : this.apiWalletService.getNativeTokenFromNetwork(coin.network);
    return new this.erc20ProviderClass(nativeCoin).value().getBalance(address);
  }

  private balanceOfNotNativeCoin(address: string, coin: Coin): Promise<BigNumber> {
    if (coin.native) {
      return Promise.resolve(BigNumber.from(0));
    }

    const provider = new this.erc20ProviderClass(coin);
    const contract = ERC20Contract.create(provider);
    return new this.erc20TokenClass(contract).balanceOf(address);
  }
}
