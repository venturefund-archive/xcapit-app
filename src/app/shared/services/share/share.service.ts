import { Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../clipboard/clipboard.service';
import { Plugins, ShareOptions, ClipboardWrite } from '@capacitor/core';
const { Share } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  constructor(
    private toastService: ToastService,
    private translate: TranslateService,
    private clipboardService: ClipboardService
  ) {}
  /**
   * Funcion que comparte segun la plataforma, si no puede lo copia al clipboard
   * @param data - Data para compartir.
   * @param copiedMessage - Es el mensaje que se muestra cuando no se puede compartir y en cambio se copia al clipboard.
   */
  share(data: ShareOptions, copiedMessage: string) {
    Share.share(data).then(
      () => {},
      () => {
        const clipboardData = {
          string: data.text,
          label: data.title,
          url: data.url
        } as ClipboardWrite;
        this.clipboardService
          .write(clipboardData)
          .then(() => this.showToast(copiedMessage));
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
