import { Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { ClipboardService } from '../clipboard/clipboard.service';
import { Share, ShareOptions } from '@capacitor/share';
import { WriteOptions } from '@capacitor/clipboard';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  sharePlugin = Share;
  constructor(private toastService: ToastService, private clipboardService: ClipboardService) {}

  async share(data: ShareOptions, copiedMessage: string) {
    this.sharePlugin.share(data).then(
      () => {},
      () => {
        const clipboardData = {
          string: data.text.concat(data.url || ''),
          label: data.title,
          url: data.url,
        } as WriteOptions;
        this.clipboardService.write(clipboardData).then(() => this.showToast(copiedMessage));
      }
    );
  }

  async canShare(): Promise<boolean> {
    return (await this.sharePlugin.canShare()).value;
  }

  private showToast(message) {
    this.toastService.showInfoToast({
      message,
    });
  }
}
