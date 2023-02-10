import { ReplaySubject, Subject } from 'rxjs';
import { ConnectionStatus, Network as CapacitorNetwork, NetworkPlugin } from '@capacitor/network';
import { FakeNetworkPlugin } from '../../network-plugin/fake/fake-network-plugin';

export class Network {
  private _status: ReplaySubject<ConnectionStatus> = new ReplaySubject<ConnectionStatus>();
  private _initialized = false;
  constructor(private _aNetworkPlugin: NetworkPlugin | FakeNetworkPlugin = CapacitorNetwork) {}
  private _initialize() {
    if (!this._initialized) {
      this._setInitialStatus();
      this._aNetworkPlugin.addListener('networkStatusChange', (status) => this._status.next(status));
    }
  }

  private async _setInitialStatus() {
    this._status.next(await this._aNetworkPlugin.getStatus());
  }
  status(): Subject<ConnectionStatus> {
    this._initialize();
    return this._status;
  }
}
