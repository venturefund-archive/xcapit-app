export interface Subscribable {

  subscribe(callback: CallableFunction): any;
}


export class SimpleSubject implements Subscribable {

  private _subscriber: CallableFunction[] = [() => Promise.resolve(false)];

  subscribe(callback: CallableFunction) {
    this._subscriber[0] = callback;
  }

  async notify(): Promise<any> {
    return await this._subscriber[0]();
  }
}
