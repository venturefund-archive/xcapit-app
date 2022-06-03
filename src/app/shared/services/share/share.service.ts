import { Injectable } from '@angular/core';
import { Share, ShareOptions } from '@capacitor/share';


@Injectable({
  providedIn: 'root',
})
export class ShareService {
  sharePlugin = Share;
  constructor() {}

  async share(data: ShareOptions) {
    return this.sharePlugin.share(data);
  }

  async canShare(): Promise<boolean> {
    return (await this.sharePlugin.canShare()).value;
  }
}
