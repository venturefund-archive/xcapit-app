export interface LocalNotification {
  send: () => Promise<void>;
  onClick: (callback: CallableFunction) => void;
}
