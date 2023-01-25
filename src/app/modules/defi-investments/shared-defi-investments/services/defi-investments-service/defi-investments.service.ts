import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DefiInvestmentsService {
  constructor(private http: CustomHttpService) {}

  fundWallet(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/faucet/fund_wallet/`, undefined, undefined, false);
  }
}
