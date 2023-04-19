import { Injectable } from '@angular/core';
import { DefaultWCUri } from 'src/app/shared/models/wallet-connect/wc-uri/default/default-wc-uri';
import { WalletConnectService } from '../wallet-connect.service';
import { WCConnectionV2 } from '../wc-connection-v2/wc-connection-v2';
import { WCUri } from 'src/app/shared/models/wallet-connect/wc-uri/wc-uri.interface';

@Injectable({ providedIn: 'root' })
export class WCService {
  private _uri: WCUri;
  constructor(private walletConnectV1: WalletConnectService, private walletConnectV2: WCConnectionV2) {}

  public set(_aWCUri: WCUri): void {
    this._uri = _aWCUri;
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
