import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';
import { FiatRampOperation } from '../interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../interfaces/fiat-ramp-provider.interface';
import { Providers } from '../models/providers/providers.interface';
import { ProvidersFactory } from '../models/providers/factory/providers.factory';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FiatRampsService {
  entity = 'on_off_ramps/provider';
  private provider = '1';
 

  constructor(private providersFactory: ProvidersFactory, private http: CustomHttpService) {}

  getQuotations(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/${this.provider}/quotations`,
      undefined,
      undefined,
      false
    );
  }

  getUserWallets(currency): Observable<any> {
    return this.http.get(`${environment.apiUrl}/apikeys/deposit_address/${currency}`, undefined, undefined, false);
  }

  getOrCreateUser(data: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/${this.provider}/get_or_create_user`,
      data,
      undefined,
      false
    );
  }

  registerUserInfo(data): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/${this.provider}/save_user_info`,
      data,
      undefined,
      false
    );
  }

  registerUserBank(data): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/${this.provider}/save_user_bank`,
      data,
      undefined,
      false
    );
  }

  registerUserImages(data): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/${this.provider}/save_user_image`,
      data,
      undefined,
      false
    );
  }

  getKriptonAccessToken(data: { email: string }): Observable<void> {
    return this.http.post(`${environment.apiUrl}/on_off_ramps/kripton/users/request_token`, data, undefined, false);
  }

  kriptonLogin(data: { email: string; token: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/on_off_ramps/kripton/users/login`, data, undefined, false);
  }

  getUserOperations(data: { email: string; auth_token: string }): Observable<FiatRampOperation[]> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/get_all_operations`, data, undefined, true);
  }

  getUserSingleOperation(
    operationId: string | number,
    data: { email: string; auth_token: string }
  ): Observable<FiatRampOperation[]> {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/${this.provider}/get_user_operation/${operationId}`,
      data,
      undefined,
      true
    );
  }

  createOperation(operationData): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/${this.provider}/create_operation`,
      operationData,
      undefined,
      false
    );
  }

  confirmOperation(operationId, operationData): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/${this.provider}/confirm_operation/${operationId}`,
      operationData,
      undefined,
      false
    );
  }

  getKriptonMinimumAmount(fiatCurrency: string, data: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/on_off_ramps/kripton/users/get_user_limits/${fiatCurrency}`,
      data,
      undefined,
      false
    );
  }

  getKriptonFee(fiatCurrency: string, amount_in: number, currency_out: string, network: string): Observable<any> {
    return this.http.post('https://app.kriptonmarket.com/public/calculate_amount_out', {
      currency_in: fiatCurrency,
      amount_in: amount_in,
      currency_out: currency_out,
      type: 'cash-in',
      network_out: network,
    });
  }

  getLink(apikeyId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/paxful/get_link`, { id_apikey: apikeyId });
  }

  getMoonpayRedirectLink(
    walletAddress: string,
    currencyCode: string,
    baseCurrencyCode: string,
    baseCurrencyAmount: number
  ): Observable<any> {
    return this.http.post(`${environment.apiUrl}/on_off_ramps/moonpay/link`, {
      wallet_address: walletAddress,
      currency_code: currencyCode,
      publishable_key: environment.moonpayPK,
      base_currency_code: baseCurrencyCode,
      base_currency_amount: baseCurrencyAmount,
    });
  }

  getDirectaExchangeRate(aFiatCurrency: string, aCryptoCurrency: string, anAmount: number): Observable<any> {
    const params = {
      params: new HttpParams({
        fromObject: {
          base: aFiatCurrency,
          quote: aCryptoCurrency,
          amount: anAmount,
        },
      }),
    };
    return this.http.get(`${environment.apiUrl}/on_off_ramps/directa/crypto_exchange_rate`, params, undefined, false);
  }

  setProvider(provider: string) {
    this.provider = provider;
  }

  userHasOperations(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/on_off_ramps/user_has_operations`, undefined, undefined, true);
  }

  getMoonpayQuotation(currencyCode: string) {
    return this.http.get(
      `${environment.moonpayApiUrl}/currencies/${currencyCode}/ask_price?apiKey=${environment.moonpayPK}`,
      undefined,
      undefined,
      false
    );
  }

  getMoonpayBuyQuote(baseCurrencyAmount: number, currencyCode: string, fiatCode: string) {
    return this.http.get(
      `${environment.moonpayApiUrl}/currencies/${currencyCode}/buy_quote/?apiKey=${environment.moonpayPK}&baseCurrencyAmount=${baseCurrencyAmount}&extraFeePercentage=1&baseCurrencyCode=${fiatCode}&paymentMethod=credit_debit_card`,
      undefined,
      undefined,
      false
    );
  }

  getMoonpayLimitOfBuyQuote(currencyCode: string, baseCurrencyCode: string = 'usd') {
    return this.http.get(
      `${environment.moonpayApiUrl}/currencies/${currencyCode}/limits?apiKey=${environment.moonpayPK}&baseCurrencyCode=${baseCurrencyCode}&paymentMethod=credit_debit_card`,
      undefined,
      undefined,
      false
    );
  }

  getProvider(providerId: number): FiatRampProvider {
    return this.providers()
      .all()
      .find((p) => p.id === providerId);
  }

  private providers(): Providers {
    return this.providersFactory.create();
  }

  getKriptonAvailableCurrencies(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/on_off_ramps/kripton/available_currencies`, undefined, undefined, undefined);
  }
}
