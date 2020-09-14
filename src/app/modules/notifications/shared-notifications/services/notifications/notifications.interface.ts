export interface INotification {
  init: (onError: any) => void;
  requestPermission: () => Promise<void>;
  pushNotificationReceived: (callback: any) => void;
  pushNotificationActionPerformed: (callback: any) => void;
}
