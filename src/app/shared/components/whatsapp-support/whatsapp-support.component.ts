import { Component } from '@angular/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';

@Component({
  selector: 'app-whatsapp-support',
  template: `<div class="ws__help">
    <div class="ws__help__tertiary-text">
      <ion-text class="ux-font-text-base">{{ 'shared.whatsapp_support.textTertiary' | translate }}</ion-text>
      <img src="/assets/img/warranties/whatsapp_support.svg" alt="Icon" />
    </div>
    <ion-button
      class="ws__help__open-support"
      name="whatsApp"
      (click)="this.openSupport()"
      appTrackClick
      fill="clear"
      size="small"
    >
      <ion-text class="ux-link-xs">{{ 'shared.whatsapp_support.textHelpLink' | translate }}</ion-text>
    </ion-button>
  </div>`,
  styleUrls: ['./whatsapp-support.component.scss'],
})
export class WhatsappSupportComponent {
  constructor(private browserService: BrowserService) {}

  async openSupport() {
    await this.browserService.open({ url: 'https://wa.link/j5hjhj' });
  }
}
