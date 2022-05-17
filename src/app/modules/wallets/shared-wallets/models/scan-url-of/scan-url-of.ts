import { environment } from 'variables.env';
import { NONPROD_SCAN_URLS } from '../../constants/scan-url-nonprod';
import { SCAN_URLS } from '../../constants/scan-urls.prod';

export class ScanUrlOf {
  constructor(private readonly aHash: string, private readonly aNetwork: string, private readonly scanUrls: any) {}

  static create(aHash: string, aNetwork: string): ScanUrlOf {
    return new this(aHash, aNetwork, environment.environment === 'PRODUCCION' ? SCAN_URLS : NONPROD_SCAN_URLS);
  }
  
  public value(): string {
    return `${this.scanUrls[this.aNetwork]}tx/${this.aHash}`;
  }
}
