import { Injectable } from '@angular/core';
import { ShareOptions } from './share-options';
import { ToastService } from '../toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

declare var navigator: any;

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  constructor(
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  share(options: ShareOptions): Promise<void|string|boolean> {
    if (!navigator.share && navigator.clipboard) {
      return this.clipboardCopy(options.url);
    } else if (!navigator.share && !navigator.clipboard) {
      return this.execCommandCopy(options.url);
    }
    return navigator.share(options);
  }

  private clipboardCopy(text: string): Promise<void> {
    return navigator.clipboard.writeText(text).then(() => this.showToast());
  }

  private execCommandCopy(text: string): Promise<string|boolean> {
    const textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    let result: Promise<string|boolean>;
    try {
      const successful = document.execCommand('copy');
      this.showToast();
      result = Promise.resolve(successful);
    } catch (err) {
      result = Promise.reject('Oops, unable to copy');
    } finally {
      document.body.removeChild(textArea);
    }
    return result;
  }

  private showToast() {
    this.toastService.showToast({
      message: this.translate.instant('shared.services.share.copy_text'),
      position: 'middle'
    });
  }
}
