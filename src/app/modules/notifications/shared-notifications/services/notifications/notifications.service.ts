import { Injectable } from '@angular/core';
import { CapacitorNotificationsService } from '../capacitor-notifications/capacitor-notifications.service';
import { Notification } from './notifications.interface';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';
import { NullNotificationsService } from '../null-notifications/null-notifications.service';
import { PlatformService } from '../../../../../shared/services/platform/platform.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  entity = 'notifications';

  constructor(
    private capacitorNotificationsService: CapacitorNotificationsService,
    private nullNotificationsService: NullNotificationsService,
    private http: CustomHttpService,
    private platformService: PlatformService
  ) {}

  getInstance(): Notification {
    return this.platformService.isNative() ? this.capacitorNotificationsService : this.nullNotificationsService;
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

  toggle(active: boolean): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/toggle/${+active}/`, {});
  }
}
