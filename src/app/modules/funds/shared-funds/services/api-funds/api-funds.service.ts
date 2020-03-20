import { Injectable } from '@angular/core';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiFundsService {
  entity = 'funds';

  crud: CRUD;

  constructor(
    private crudService: CrudService,
    private http: CustomHttpService
  ) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }

  getSubscribedFunds(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/subscribed_funds`
    );
  }

  getStatus(fundName: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/name/${fundName}/status`
    );
  }

  getBalance(fundName: string, toCa: string = ''): Observable<any> {
    // TODO: Sacar timeout, es solo para probar el loading.
    return this.http.original.get(
      `${environment.apiUrl}/${this.entity}/name/${fundName}/balance`,
      {
        params: {
          to_ca: toCa
        }
      }
    ).pipe(timeout(2000));
  }

  getFundRuns(status: string, fundName: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/fund_runs/${status}/${fundName}`
    );
  }

  changeFundCA(fundName: string, ca: string): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/${this.entity}/change_fund_ca/${fundName}/ca/${ca}`,
      {}
    );
  }

  pauseFundRuns(fundName: string): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/${this.entity}/pause_fund_runs/${fundName}`,
      {}
    );
  }

  resumeFundRuns(fundName: string): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/${this.entity}/resume_fund_runs/${fundName}`,
      {}
    );
  }

  finalizeFundRuns(fundName: string): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/${this.entity}/finalize_fund_runs/${fundName}`,
      {}
    );
  }

  renewFund(fundData: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/renew_fund`,
      fundData
    );
  }

  getDepositAdress(currency: string): Observable<any> {
    return this.http.original.get(
      `${environment.apiUrl}/${this.entity}/deposit_address/${currency}`
    );
  }

  isSubscribed(fundName: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/name/${fundName}/is_subscribed`
    );
  }

  getCommissions(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${this.entity}/commissions`);
  }

  isOwner(fundName: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/name/${fundName}/is_owner`
    );
  }

  getFundBalances(owner: string | boolean = 'all'): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/balances/owner/${owner}`
    );
  }

  getMostChosenTP() {
    // TODO: Ver como hacer para tener el mas elegido sin hacer el calculo cada vez.
    return of(10);
  }

  getMostChosenSL() {
    // TODO: Ver como hacer para tener el mas elegido sin hacer el calculo cada vez.
    return of(10);
  }

  getTotalBalance(ca: string) {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/total_balance/ca/${ca}`
    );
  }

  count(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${this.entity}/count`);
  }
}
