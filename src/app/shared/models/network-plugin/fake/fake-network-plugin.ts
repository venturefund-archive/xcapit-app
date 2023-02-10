import { ConnectionStatus } from '@capacitor/network';

export class FakeNetworkPlugin {
  constructor(private _aConnectionStatus: ConnectionStatus = { connected: true, connectionType: 'wifi' }) {}
  addListener(aName: string, callback: CallableFunction): void {
    callback(this._aConnectionStatus);
  }

  getStatus(): Promise<ConnectionStatus> {
    return Promise.resolve(this._aConnectionStatus);
  }
}
