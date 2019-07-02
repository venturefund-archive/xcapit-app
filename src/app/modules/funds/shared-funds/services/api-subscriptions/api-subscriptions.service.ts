import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { API_URL } from 'src/app/config/app-constants.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiSubscriptionsService {
  entity = 'subscriptions';

  constructor(private http: CustomHttpService) { }

  getSubscriptionLink(fundName: string): Observable<any> {
    return this.http.get(`${API_URL}/${this.entity}/link/funds/name/${fundName}`);
  }
}
