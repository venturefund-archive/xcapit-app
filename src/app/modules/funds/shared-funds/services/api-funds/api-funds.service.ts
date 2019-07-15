import { Injectable } from '@angular/core';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable } from 'rxjs';
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
    return this.http.get(`${environment.apiUrl}/${this.entity}/subscribed_funds`);
  }

  getStatus(fundName: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${this.entity}/name/${fundName}/status`);
  }

  getBalance(fundName: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${this.entity}/name/${fundName}/balance`);
  }

  getFundRuns(status: string, fundName: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/fund_runs/${status}/${fundName}`
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
    return this.http.post(`${environment.apiUrl}/${this.entity}/renew_fund`, fundData);
  }
}
