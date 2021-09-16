import { Injectable } from '@angular/core';
import { CapacitorNotificationsService } from '../capacitor-notifications/capacitor-notifications.service';
import { INotification } from './notifications.interface';
import { PwaNotificationsService } from '../pwa-notifications/pwa-notifications.service';
import { Capacitor } from '@capacitor/core';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  entity = 'notifications';

  constructor(
    private capacitorNotificationsService: CapacitorNotificationsService,
    private pwaNotificationsService: PwaNotificationsService,
    private http: CustomHttpService
  ) {}

  getInstance(): INotification {
    return Capacitor.platform !== 'web' ? this.capacitorNotificationsService : this.pwaNotificationsService;
  }

  getNotifications(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${this.entity}/`, undefined, undefined, false);
  }

  markAsRead(): Observable<any> {
    return this.http.put(`${environment.apiUrl}/${this.entity}/`, undefined);
  }

  getCountNotifications(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${this.entity}/count`, undefined, undefined, false);
  }

  registerDevice(fcmToken: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/device/fcm`, { fcm_registration_id: fcmToken });
  }
}
