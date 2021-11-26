import { Component, OnInit } from '@angular/core';
import { BrowserService } from '../../services/browser/browser.service';

@Component({
  selector: 'app-ux-card-info-robot',
  template: `
    <div class="cir ion-padding">
      <div class="cir__title ux-font-text-xl ion-text-center">
        <ion-text>{{ 'shared.card_info_robot.title' | translate }}</ion-text>
      </div>
      <div class="cir__content ux-font-text-xs semibold ion-text-center">
        <ion-text>{{ 'shared.card_info_robot.content' | translate }}</ion-text>
      </div>
      <div class="cir__action">
        <ion-button appTrackClick name="More Info" (click)="this.moreInfo()" expand="block" class="ux_button">
          {{ 'shared.card_info_robot.action' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./ux-card-info-robot.component.scss'],
})
export class UxCardInfoRobotComponent implements OnInit {
  constructor(private browserService: BrowserService) {}

  ngOnInit() {}

  async moreInfo() {
    await this.browserService.open({ url: 'https://www.info.xcapit.com/' });
  }
}
