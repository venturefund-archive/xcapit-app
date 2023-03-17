import { Injectable } from '@angular/core';
import { WCUri } from 'src/app/shared/models/wallet-connect/wc-uri/WCUri';
import { WalletConnectService } from '../wallet-connect.service';
import { WCConnectionV2 } from '../wc-connection-v2/wc-connection-v2';

@Injectable({ providedIn: 'root' })
export class WCService {
  private _uri: WCUri;
  constructor(private walletConnectV1: WalletConnectService, private walletConnectV2: WCConnectionV2) {}

  public initialize(uri: string): void {
    this._uri = new WCUri(uri);
  }

  public uri(): WCUri {
    return this._uri;
  }

  public connected(): boolean {
    let _connected = false;
    if (this._uri) {
      _connected = this._uri.isV2() ? this.walletConnectV2.connected() : this.walletConnectV1.connected;
    }
    return _connected;
  }
}
