import { Component, Input, OnInit } from '@angular/core';
import { LINKS } from '../../../config/static-links';
import { BrowserService } from '../../services/browser/browser.service';

@Component({
  selector: 'app-need-help',
  template: `
    <div class="need-help">
      <div class="need-help__icon-buttons">
        <ion-button
          (click)="openWhatsAppLink()"
          *ngIf="this.whatsAppLink"
          fill="clear"
          appTrackClick
          name="WhatsApp Help"
        >
          <ion-icon name="logo-whatsapp"></ion-icon>
        </ion-button>
        <ion-button
          (click)="openTelegramLink()"
          *ngIf="this.telegramLink"
          fill="clear"
          appTrackClick
          name="Telegram Help"
        >
          <ion-icon name="paper-plane-outline"></ion-icon>
        </ion-button>
      </div>
      <div class="need-help__link">
        <ion-button
          name="Go To Help"
          (click)="this.moreInfo()"
          class="link ux-link-xs"
          appTrackClick
          fill="clear"
          size="small"
        >
          {{ 'shared.need_help.text_help_link' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./need-help.component.scss'],
})
export class NeedHelpComponent implements OnInit {
  @Input() whatsAppLink: string;
  @Input() telegramLink: string;
  links = LINKS;

  constructor(private browserService: BrowserService) {}

  ngOnInit() {}

  async moreInfo() {
    await this.browserService.open({
      url: this.links.generalHelp,
    });
  }

  async openWhatsAppLink() {
    if (this.whatsAppLink) {
      await this.browserService.open({
        url: this.whatsAppLink,
      });
    }
  }

  async openTelegramLink() {
    if (this.telegramLink) {
      await this.browserService.open({
        url: this.telegramLink,
      });
    }
  }
}
