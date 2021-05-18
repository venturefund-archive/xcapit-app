import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FiatRampsService {
  entity = 'on_off_ramps/provider';
  private provider = '1';

  constructor(private http: CustomHttpService) {}

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

  getUserOperations(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${this.entity}/get_all_operations`, undefined, undefined, true);
  }

  getUserSingleOperation(operationId): Observable<any> {
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

  setProvider(provider: string) {
    this.provider = provider;
  }

  userHasOperations(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/on_off_ramps/user_has_operations`,
      undefined,
      undefined,
      true
    );
  }
}
