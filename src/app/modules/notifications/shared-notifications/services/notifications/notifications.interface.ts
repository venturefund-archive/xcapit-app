export interface INotification {
  init: () => void;
  requestPermission: () => Promise<void>;
  pushNotificationReceived: (callback: any) => void;
  pushNotificationActionPerformed: (callback: any) => void;
}
