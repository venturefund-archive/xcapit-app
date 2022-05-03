import { Injectable } from '@angular/core';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { TransactionResponse, Provider } from '@ethersproject/abstract-provider';
import { Coin } from '../../interfaces/coin.interface';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from '../../../../../../environments/environment';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CovalentQuoteCurrency } from '../../types/covalent-quote-currencies.type';
import { CovalentTransfersResponse } from '../../models/covalent-transfers-response/covalent-transfers-response';
import { BigNumber, VoidSigner, Wallet } from 'ethers';
import { personalSign, signTypedData_v4 } from 'eth-sig-util';
import { TokenSend } from '../../models/token-send/token-send.model';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { ERC20Contract } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { NetworkConfig } from '../../models/network-config/network-config';
import { FormattedFee } from 'src/app/modules/defi-investments/shared-defi-investments/models/formatted-fee/formatted-fee.model';
import { NativeFeeOf } from 'src/app/modules/defi-investments/shared-defi-investments/models/native-fee-of/native-fee-of.model';
import { NativeGasOf } from 'src/app/shared/models/native-gas-of/native-gas-of';
import { GasFeeOf } from '../../../../defi-investments/shared-defi-investments/models/gas-fee-of/gas-fee-of.model';
import { Fee } from 'src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface';
import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.interface';
import { ERC20ProviderController } from '../../../../defi-investments/shared-defi-investments/models/erc20-provider/controller/erc20-provider.controller';
import { ERC20ContractController } from '../../../../defi-investments/shared-defi-investments/models/erc20-contract/controller/erc20-contract.controller';
import { ERC20TokenController } from '../../../../defi-investments/shared-defi-investments/models/erc20-token/controller/erc20-token.controller';
import { ERC20Token } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-token/erc20-token.interface';
import { FormattedFeeController } from '../../../../defi-investments/shared-defi-investments/models/formatted-fee/controller/formatted-fee.controller';
import { FakeProvider } from 'src/app/shared/models/provider/fake-provider.spec';

@Injectable({
  providedIn: 'root',
})
export class WalletTransactionsService {
  tokenSendClass: any = TokenSend;
  authHeaders = { Authorization: `Basic ${btoa(environment.covalentApiKey + ':')}` };

  constructor(
    private walletEncryptionService: WalletEncryptionService,
    private storageService: StorageService,
    private http: CustomHttpService,
    private apiWalletService: ApiWalletService,
    private erc20ProviderController: ERC20ProviderController,
    private erc20ContractController: ERC20ContractController,
    private erc20TokenController: ERC20TokenController,
    private formattedFeeController: FormattedFeeController
  ) {}

  async send(password: string, amount: number, to: string, coin: Coin): Promise<TransactionResponse> {
    const from = await this.storageService.getWalletsAddresses(coin.network);
    const wallet = await this.walletEncryptionService.getDecryptedWalletForCurrency(password, coin);
    const tx = new this.tokenSendClass(
      from,
      to,
      amount.toString(),
      coin,
      this.apiWalletService,
      wallet,
      new NetworkConfig(coin.network, this.apiWalletService)
    ).value();
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
    return asset.native
      ? `${environment.covalentApiUrl}${asset.chainId}/address/${address}/transactions_v2/?no-logs=true&match={"value":{"$ne": "0"}}&limit=10&quote-currency=${quoteCurrency}`
      : `${environment.covalentApiUrl}${asset.chainId}/address/${address}/transfers_v2/?contract-address=${asset.contract}&limit=10&quote-currency=${quoteCurrency}`;
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

  async canAffordSendTx(to: string, amount: number, coin: Coin): Promise<boolean> {
    const from = await this.storageService.getWalletsAddresses(coin.network);
    const feePromise = this.sendEstimatedFee(from, to, amount, coin);
    const nativeBalancePromise = this.balanceOfNativeCoin(from, coin);
    const nonNativeBalancePromise = this.balanceOfNotNativeCoin(from, coin);

    return Promise.all([feePromise, nativeBalancePromise, nonNativeBalancePromise])
      .then(([fee, nativeBalance, nonNativeBalance]) => {
        const totalNativeCoin = coin.native ? parseEther(fee).add(parseEther(amount.toString())) : parseEther(fee);
        const totalNonNativeCoin = coin.native ? 0 : parseUnits(amount.toString(), coin.decimals);

        return !!(nativeBalance.gte(totalNativeCoin) && nonNativeBalance.gte(totalNonNativeCoin));
      })
      .catch(() => false);
  }

  async canAffordSendFee(to: string, amount: number, coin: Coin): Promise<boolean> {
    const from = await this.storageService.getWalletsAddresses(coin.network);
    const feePromise = this.sendEstimatedFee(from, to, amount, coin);
    const nativeBalancePromise = this.balanceOfNativeCoin(from, coin);

    return Promise.all([feePromise, nativeBalancePromise]).then(([fee, nativeBalance]) => {
      return !!nativeBalance.gte(parseEther(fee));
    });
  }

  private async gasPrice(): Promise<BigNumber> {
    return await this.apiWalletService
      .getGasPrice()
      .toPromise()
      .then((res) => res.gas_price);
  }

  private _weiOf(coin: Coin, amount: number): BigNumber {
    return parseUnits(amount.toFixed(coin.decimals), coin.decimals);
  }

  async sendEstimatedFee(from: string, to: string, amount: number, coin: Coin): Promise<string> {
    let gas: Fee;

    if (coin.native) {
      gas = NativeGasOf.create(coin, { to: to, value: this._weiOf(coin, amount) });
    } else {
      gas = new GasFeeOf(this.erc20Contract(coin, from).value(), 'transfer', [to, amount]);
    }
    const fee = new NativeFeeOf(gas, new FakeProvider(await this.gasPrice()));
    return (await this.formattedFee(fee).value()).toString();
  }

  private balanceOfNativeCoin(address: string, coin: Coin): Promise<BigNumber> {
    const nativeCoin = coin.native ? coin : this.apiWalletService.getNativeTokenFromNetwork(coin.network);
    return this.erc20Provider(nativeCoin).value().getBalance(address);
  }

  private balanceOfNotNativeCoin(address: string, coin: Coin): Promise<BigNumber> {
    return coin.native
      ? Promise.resolve(BigNumber.from(0))
      : this.erc20Token(this.erc20Contract(coin)).balanceOf(address);
  }

  erc20Contract(coin: Coin, address?: string): ERC20Contract {
    const signer = address ? new VoidSigner(address) : undefined;
    return this.erc20ContractController.new(this.erc20Provider(coin), signer);
  }

  erc20Provider(coin: Coin): ERC20Provider {
    return this.erc20ProviderController.new(coin);
  }

  erc20Token(contract: ERC20Contract): ERC20Token {
    return this.erc20TokenController.new(contract);
  }

  formattedFee(fee: Fee, decimals: number = undefined): FormattedFee {
    return this.formattedFeeController.new(fee, decimals);
  }
}
