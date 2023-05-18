export interface Notification {
  pushNotificationReceived: (callback: any) => void;
  pushNotificationActionPerformed: (callback: any) => void;
  unsubscribeFrom: (aTopic: string) => void;
  subscribeTo: (aTopic: string) => void;
}
