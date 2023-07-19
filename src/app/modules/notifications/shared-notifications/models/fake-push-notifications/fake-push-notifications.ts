export class FakePushNotifications {
  private _events = {};

  constructor() {}

  addListener(anEventName: string, aCallbackFunction: CallableFunction): void {
    this._events[anEventName] = aCallbackFunction;
  }

  async executeRegisteredEvents() {
    for (const eventKey of Object.keys(this._events)) {
      await this._events[eventKey]({ value: 'aFCMToken' });
    }
  }

  async register() {
    await this.executeRegisteredEvents();
  }
}
