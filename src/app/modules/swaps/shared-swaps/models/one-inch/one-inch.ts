import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { Blockchain } from '../blockchain/blockchain';
import { Dex } from '../dex';
import { Referral } from '../referral/referral';
import { Slippage } from '../slippage/slippage';
import { Swap } from '../swap/swap';
import { Token } from '../token/token';
import { Wallet } from '../../../../wallets/shared-wallets/models/wallet/wallet';
import { environment } from 'src/environments/environment';

export class OneInch implements Dex {
  private readonly _apiVersion = '5.2';
  private readonly _baseUrl = `${environment.oneInchApiUrl}swap/v${this._apiVersion}`;

  constructor(private _blockchain: Blockchain, private _httpClient: HttpClient | FakeHttpClient) {}

  private _url(): string {
    return `${this._baseUrl}/${this._blockchain.id()}`;
  }
  private _headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.oneInchApiKey}`,
    });
  }

  async swap(aSwap: Swap, fromWallet: Wallet, slippage: Slippage, referral: Referral): Promise<any> {
    return await this._httpClient
      .get(`${this._url()}/swap`, {
        params: {
          src: aSwap.fromToken().address(),
          dst: aSwap.toToken().address(),
          amount: aSwap.weiAmount().value().toString(),
          from: fromWallet.address(),
          slippage: slippage.value(),
          referrer: referral.walletAddress(),
          fee: referral.fee(),
        },
        headers: this._headers(),
      })
      .toPromise();
  }

  async approve(aSwap: Swap): Promise<any> {
    return await this._httpClient
      .get(`${this._url()}/approve/transaction`, {
        params: {
          tokenAddress: aSwap.fromToken().address(),
          amount: aSwap.weiAmount().value().toString(),
        },
        headers: this._headers(),
      })
      .toPromise();
  }

  async tokens(): Promise<any> {
    return this._httpClient.get(`${this._url()}/tokens`, { headers: this._headers() }).toPromise();
  }

  async allowance(aToken: Token, fromWallet: Wallet): Promise<any> {
    return this._httpClient
      .get(`${this._url()}/approve/allowance`, {
        params: {
          tokenAddress: aToken.address(),
          walletAddress: fromWallet.address(),
        },
        headers: this._headers(),
      })
      .toPromise();
  }

  async swapInfo(aSwap: Swap, aReferral: Referral): Promise<any> {
    return this._httpClient
      .get(`${this._url()}/quote`, {
        params: {
          src: aSwap.fromToken().address(),
          dst: aSwap.toToken().address(),
          amount: aSwap.weiAmount().value().toString(),
          fee: aReferral.fee(),
        },
        headers: this._headers(),
      })
      .toPromise();
  }
}
