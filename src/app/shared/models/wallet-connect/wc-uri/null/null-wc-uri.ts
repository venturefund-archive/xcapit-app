import { WCUri } from '../wc-uri.interface';

export class NullWCUri implements WCUri {
  public value(): string {
    return '';
  }

  public isV2(): boolean {
    return false;
  }
}
