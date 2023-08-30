import { HttpClient } from "@angular/common/http";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { Blockchain } from "../blockchain/blockchain";
import { Dex } from "../dex";
import { Referral } from "../referral/referral";
import { Slippage } from "../slippage/slippage";
import { Swap } from "../swap/swap";
import { Token } from "../token/token";
import { Wallet } from "../../../../wallets/shared-wallets/models/wallet/wallet";


export class OneInch implements Dex {

  private readonly _baseUrl = 'https://api.1inch.io/v4.0';

  constructor(
    private _blockchain: Blockchain,
    private _httpClient: HttpClient | FakeHttpClient
  ) { }

  private _url(): string {
    return `${this._baseUrl}/${this._blockchain.id()}`;
  }

  async swap(aSwap: Swap, fromWallet: Wallet, slippage: Slippage, referral: Referral): Promise<any> {
    return await this._httpClient.get(
      `${this._url()}/swap`,
      {
        params: {
          fromTokenAddress: aSwap.fromToken().address(),
          toTokenAddress: aSwap.toToken().address(),
          amount: aSwap.weiAmount().value().toString(),
          fromAddress: fromWallet.address(),
          slippage: slippage.value(),
          referrerAddress: referral.walletAddress(),
          fee: referral.fee()
        }
      }).toPromise();
  }

  async approve(aSwap: Swap): Promise<any> {
    return await this._httpClient.get(
      `${this._url()}/approve/transaction`,
      {
        params: {
          tokenAddress: aSwap.fromToken().address(),
          amount: aSwap.weiAmount().value().toString()
        }
      }
    ).toPromise();
  }

  async tokens(): Promise<any> {
    return this._httpClient.get(`${this._url()}/tokens`).toPromise();
  }

  async allowance(aToken: Token, fromWallet: Wallet): Promise<any> {
    return this._httpClient.get(
      `${this._url()}/approve/allowance`,
      {
        params: {
          tokenAddress: aToken.address(),
          walletAddress: fromWallet.address()
        }
      }
    ).toPromise();
  }

  async swapInfo(aSwap: Swap, aReferral: Referral): Promise<any> {
    return this._httpClient.get(`${this._url()}/quote`, {
      params: {
        fromTokenAddress: aSwap.fromToken().address(),
        toTokenAddress: aSwap.toToken().address(),
        amount: aSwap.weiAmount().value().toString(),
        fee: aReferral.fee()
      }
    }).toPromise();
  }
}
