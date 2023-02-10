import { Component } from '@angular/core';

@Component({
  selector: 'app-no-connection-banner',
  template: `
    <div class="nc">
      <ion-text class="ux-font-text-xxs">{{ 'shared.no_connection_banner.disclaimer' | translate }}</ion-text>
    </div>
  `,
  styleUrls: ['./no-connection-banner.component.scss'],
})
export class NoConnectionBannerComponent {}
