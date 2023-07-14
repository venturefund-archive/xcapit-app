import { Observable } from "rxjs";

export interface Notification {
  pushNotificationReceived: (callback: any) => void;
  pushNotificationActionPerformed: (callback: any) => void;
  unsubscribeFrom: (aTopic: string) => void;
  subscribeTo: (aTopic: string) => void;
  init: () => void;
  register: () => void;
  clearRegistration: () => void;
  toggleUserNotifications: (active: boolean) => Observable<any>;
}
