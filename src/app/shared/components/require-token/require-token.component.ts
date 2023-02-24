import { Component, Input  } from '@angular/core';
import { LINKS } from '../../../config/static-links';
import { BrowserService } from '../../services/browser/browser.service';

@Component({
  selector: 'app-require-token',
  template: `
    <div class="rt">
      <ion-text color="neutral80" class="">{{ 'shared.require_token.description' | translate }}</ion-text>
      <ion-button
        appTrackClick
        [dataToTrack]="{ eventLabel: this.buttonEventName }"
        class="ux-link-xs underline"
        (click)="this.openRequireTokenForm()"
        fill="clear"
        size="small"
        >{{ 'shared.require_token.button' | translate }}</ion-button
      >
    </div>
  `,
  styleUrls: ['./require-token.component.scss'],
})
export class RequireTokenComponent {
  @Input() buttonEventName: string;
  constructor(private browserService: BrowserService) {}
  openRequireTokenForm() {
    this.browserService.open({
      url: LINKS.requireToken,
    });
  }
}
