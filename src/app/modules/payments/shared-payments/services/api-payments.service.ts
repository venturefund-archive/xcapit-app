import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiPaymentsService {
  constructor(private http: CustomHttpService) {}

  getPaymentMethods(planID: string) {
    return this.http.get(`${environment.apiUrl}/subscription_plans/plans/${planID}/payment_methods`);
  }

  registerLicense(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/subscription_plans/free_subscription/`, {});
  }
}
