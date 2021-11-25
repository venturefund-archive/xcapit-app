import { Component, Input, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { LINKS } from '../../../config/static-links';

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

  constructor() {}

  ngOnInit() {}

  async moreInfo() {
    await Browser.open({
      toolbarColor: '#ff9100',
      url: this.links.generalHelp,
    });
  }

  async openWhatsAppLink() {
    if (this.whatsAppLink) {
      await Browser.open({
        toolbarColor: '#ff9100',
        url: this.whatsAppLink,
      });
    }
  }

  async openTelegramLink() {
    if (this.telegramLink) {
      await Browser.open({
        toolbarColor: '#ff9100',
        url: this.telegramLink,
      });
    }
  }
}
