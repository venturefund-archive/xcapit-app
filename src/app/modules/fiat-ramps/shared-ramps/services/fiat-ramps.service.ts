import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';
import { OPERATION_STATUS } from '../constants/operation-status';
import { FiatRampOperation } from '../interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../interfaces/fiat-ramp-provider.interface';
import { OperationStatus } from '../interfaces/operation-status.interface';
import { Providers } from '../models/providers/providers.interface';
import { ProvidersFactory } from '../models/providers/factory/providers.factory';
import { RemoteConfigService } from '../../../../shared/services/remote-config/remote-config.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FiatRampsService {
  entity = 'on_off_ramps/provider';
  private provider = '1';
  operationStatus: OperationStatus[] = OPERATION_STATUS;

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

  checkUser(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/${this.provider}/check_user`,
      undefined,
      undefined,
      false
    );
  }

  createUser(): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/${this.provider}/create_user`,
      undefined,
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

  getUserOperations(): Observable<FiatRampOperation[]> {
    return this.http.get(`${environment.apiUrl}/${this.entity}/get_all_operations`, undefined, undefined, true);
  }

  getUserSingleOperation(operationId): Observable<FiatRampOperation[]> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/${this.provider}/get_user_operation/${operationId}`,
      undefined,
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

  getLink(apikeyId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/paxful/get_link`, { id_apikey: apikeyId });
  }

  getMoonpayLink(walletAddress: string, currencyCode: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/on_off_ramps/moonpay/link`, {
      wallet_address: walletAddress,
      currency_code: currencyCode,
      publishable_key: environment.moonpayPK,
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

  getProvider(providerId: number): FiatRampProvider {
    return this.providers()
      .all()
      .find((p) => p.id === providerId);
  }

  getOperationStatus(name: string, providerId?: number): OperationStatus {
    let operationStatus: OperationStatus;

    if (providerId) {
      operationStatus = this.operationStatus.find((o) => o.name === name && o.providerId === providerId);
    } else {
      operationStatus = this.operationStatus.find((o) => o.name === name);
    }

    operationStatus.provider = this.getProvider(operationStatus.providerId);

    return operationStatus;
  }

  private providers(): Providers {
    return this.providersFactory.create();
  }
}