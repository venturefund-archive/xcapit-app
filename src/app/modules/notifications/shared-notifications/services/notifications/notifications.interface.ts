export interface Notification {
  init: () => void;
  requestPermission: () => Promise<void>;
  pushNotificationReceived: (callback: any) => void;
  pushNotificationActionPerformed: (callback: any) => void;
}
