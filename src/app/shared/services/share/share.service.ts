import { Injectable } from '@angular/core';
import { ShareOptions } from './share-options';
import { ToastService } from '../toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../clipboard/clipboard.service';

declare var navigator: any;

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  constructor(
    private toastService: ToastService,
    private translate: TranslateService,
    private clipboard: ClipboardService
  ) {}

  share(options: ShareOptions): Promise<void|string|boolean> {
    return navigator.share ?
      navigator.share(options) : this.clipboard.copy(options.url).then(() => this.showToast());
  }

  private showToast() {
    this.toastService.showToast({
      message: this.translate.instant('shared.services.share.copy_text'),
      position: 'middle'
    });
  }
}
