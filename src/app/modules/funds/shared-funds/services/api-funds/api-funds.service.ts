import { Injectable } from '@angular/core';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  getPerformance(
    fundName: string,
    run: string = '',
    delta: string = '',
    loading = true
  ): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/name/${fundName}/performance`,
      { params: { id_corrida: run, delta } },
      undefined,
      loading
    );
  }

  getBalance(
    fundName: string,
    toCa: string = '',
    loading = true
  ): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/name/${fundName}/balance`,
      {
        params: {
          to_ca: toCa
        }
      },
      undefined,
      loading
    );
  }

  getMetrics(fundName: string, loading = true): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/name/${fundName}/metrics`,
      undefined,
      undefined,
      loading
    );
  }

  getFundRuns(
    status: string,
    fundName: string,
    loading = true
  ): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/fund_runs/${status}/${fundName}`,
      undefined,
      undefined,
      loading
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
      `${environment.apiUrl}/${this.entity}/name/${fundName}/pause`,
      {}
    );
  }

  resumeFundRuns(fundName: string): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/${this.entity}/name/${fundName}/resume`,
      {}
    );
  }

  finalizeFundRuns(fundName: string): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/${this.entity}/name/${fundName}/finalize`,
      {}
    );
  }

  renewFund(fundData: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/renew`,
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

  getFundBalances(
    owner: string | boolean = 'all',
    loading = true
  ): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/balances/owner/${owner}`,
      undefined,
      undefined,
      loading
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

  getTotalBalance(ca: string, loading = true) {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/total_balance/ca/${ca}`,
      undefined,
      undefined,
      loading
    );
  }

  count(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/count`,
      undefined,
      undefined,
      false
    );
  }
}
