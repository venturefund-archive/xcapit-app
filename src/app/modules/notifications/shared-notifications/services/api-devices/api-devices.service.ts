import { Injectable } from '@angular/core';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiDevicesService {
  crud: CRUD;

  entity = 'notifications/device';

  constructor(private http: CustomHttpService) {}

  register(fcmToken: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/fcm`, { fcm_registration_id: fcmToken });
  }
}
