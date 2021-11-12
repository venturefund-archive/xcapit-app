import { Injectable } from '@angular/core';
import { CapacitorNotificationsService } from '../capacitor-notifications/capacitor-notifications.service';
import { INotification } from './notifications.interface';
import { Capacitor } from '@capacitor/core';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';
import { NullNotificationsService } from '../null-notifications/null-notifications.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  entity = 'notifications';

  constructor(
    private capacitorNotificationsService: CapacitorNotificationsService,
    private nullNotificationsService: NullNotificationsService,
    private http: CustomHttpService
  ) {}

  getInstance(): INotification {
    return Capacitor.platform !== 'web' ? this.capacitorNotificationsService : this.nullNotificationsService;
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
}
