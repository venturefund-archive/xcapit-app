import { parseUri } from '@walletconnect/utils';

export class WCUri {
  constructor(private readonly _uri: string) {}

  public value(): string {
    return this._uri;
  }

  public isV2(): boolean {
    return parseUri(this._uri).version === 2;
  }
}
