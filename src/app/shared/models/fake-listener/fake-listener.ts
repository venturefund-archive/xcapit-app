export class FakeListener {
  private _events = {};

  constructor() {}

  addListener(anEventName: string, aCallbackFunction: CallableFunction): void {
    this._events[anEventName] = aCallbackFunction;
  }

  async executeEvent(anEventName: string, withParams: any = null) {
    await this._events[anEventName](withParams);
  }

  removeAllListeners() {
    this._events = {};
  }

  eventsCount(): number {
    return Object.entries(this._events).length;
  }
}
