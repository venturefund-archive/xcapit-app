import { ScheduleOptions, ScheduleResult } from '@capacitor/local-notifications';

export class FakeLocalNotificationPlugin {
  constructor(private readonly checkPermissionsReturnValue: Promise<any> = Promise.resolve({ display: 'granted' })) {}

  checkPermissions(): Promise<any> {
    return this.checkPermissionsReturnValue;
  }

  schedule(options: ScheduleOptions): Promise<ScheduleResult> {
    return Promise.resolve({ notifications: [{ id: options.notifications[0].id }] });
  }

  addListener(eventName: string, callableFunction: CallableFunction){
    return undefined;
  }

  removeAllListeners() : Promise<void>{
    return undefined;
  }
}
