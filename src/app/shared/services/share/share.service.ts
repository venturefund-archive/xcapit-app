import { Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../clipboard/clipboard.service';
import { Plugins, ShareOptions } from '@capacitor/core';
const { Share } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  constructor(
    private toastService: ToastService,
    private translate: TranslateService,
    private clipboardService: ClipboardService
  ) {
  }

  share(data: ShareOptions) {
    console.log(data);
    Share.share(data).then(
      () => {},
      () => {
        this.clipboardService
          .write(data)
          .then(() =>
            this.showToast(
              this.translate.instant('shared.services.share.copy_text')
            )
          );
      }
    );
  }

  private showToast(message) {
    this.toastService.showToast({
      message,
      position: 'middle'
    });
  }
}
