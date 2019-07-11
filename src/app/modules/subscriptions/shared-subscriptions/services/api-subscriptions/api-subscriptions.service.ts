import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiSubscriptionsService {
  entity = 'subscriptions';

  constructor(private http: CustomHttpService) {}

  getSubscriptionLink(fundName: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/link/funds/name/${fundName}`
    );
  }

  subscribeToFund(subscriptionToken: string, fundNameb64: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/subscribe`, {
      subscription_token: subscriptionToken,
      fund_name_b64: fundNameb64
    });
  }
}
