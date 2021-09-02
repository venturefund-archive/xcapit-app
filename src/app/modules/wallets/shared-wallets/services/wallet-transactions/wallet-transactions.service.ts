import { Injectable } from '@angular/core';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { LoadingService } from '../../../../../shared/services/loading/loading.service';
import { ethers } from 'ethers';
import { BlockchainProviderService } from '../brockchain-provider/blockchain-provider.service';
import { Coin } from '../../interfaces/coin.interface';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WalletTransactionsService {
  constructor(
    private walletEncryptionService: WalletEncryptionService,
    private loadingService: LoadingService,
    private blockchainProviderService: BlockchainProviderService,
    private storageService: StorageService,
    private http: CustomHttpService
  ) {}

  async send(password: string, amount: number | string, targetAddress: string, currency: Coin, loading = true) {
    if (loading) await this.loadingService.show();
    const wallet = await this.walletEncryptionService.getDecryptedWallet(password);
    const provider = (await this.blockchainProviderService.getProvider(currency.value)).provider;
    wallet.connect(provider).sendTransaction({
      to: targetAddress,
      value: ethers.utils.parseEther(amount.toString()),
    });
    await this.loadingService.dismiss();
  }

  async getAllTransactions(): Promise<any> {
    return new Promise<any>(async (resolve) => {
      const addresses = await this.storageService.getWalletsAddresses();

      /*
       * El método "alchemy_getAssetTransfers" sólo funciona en mainnet
       * Se agrega urlProvider de mainnet y datos de prueba para testing
       */

      const urlProvider = 'https://eth-mainnet.alchemyapi.io/v2/-6TB-QpsZnR6WfJJjO3u6BZhGINLDgFH';
      // test mainnet address 0x9cBb2b28dF12A6f520Cfd4a97b8C89f89EE10C59 / 0x39F65f7F9418a35b5A8d07f08Ac9484b03d46295

      this.getTransactions(addresses.ETH_TEST, urlProvider).subscribe((response) => {
        resolve(response);
      });
    });
  }

  async getLastTransaction(): Promise<any> {
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
    const bodyReceived = {
      jsonrpc: '2.0',
      id: 2,
      method: 'alchemy_getAssetTransfers',
      params: [
        {
          fromBlock: '0x0000000',
          toBlock: 'latest',
          toAddress: address,
          excludeZeroValue: true,
          category: ['external', 'token'],
        },
      ],
    };

    const bodySended = {
      jsonrpc: '2.0',
      id: 2,
      method: 'alchemy_getAssetTransfers',
      params: [
        {
          fromBlock: '0x0000000',
          toBlock: 'latest',
          fromAddress: address,
          excludeZeroValue: true,
          category: ['external', 'token'],
        },
      ],
    };

    return forkJoin([this.http.post(urlProvider, bodyReceived), this.http.post(urlProvider, bodySended)]).pipe(
      map((response) => {
        const received = this.mapResponse(response[0].result.transfers, 'received');
        const sended = this.mapResponse(response[1].result.transfers, 'sended');

        return this.mergeTransactions(received, sended);
      })
    );
  }

  mapResponse(response, action) {
    const res = [];

    for (const tx of response) {
      if (!!tx.asset) {
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
            amounOut: null,
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
}
