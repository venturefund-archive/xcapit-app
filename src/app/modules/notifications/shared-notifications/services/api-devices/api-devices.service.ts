import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiDevicesService {
  entity = 'notifications/device';

  constructor(private http: CustomHttpService) {}

  register(fcmToken: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/fcm`, { fcm_registration_id: fcmToken }, '', false);
  }
}
