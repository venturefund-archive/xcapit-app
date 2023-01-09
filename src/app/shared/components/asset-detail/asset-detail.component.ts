import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-asset-detail',
  template: `
    <div class="ad">
      <div class="ad__title">
        <ion-text class="ux-font-text-xl">{{ this.token }}</ion-text>
        <app-token-network-badge [blockchainName]="this.blockchain"></app-token-network-badge>
      </div>
      <img [src]="this.tokenLogo" />
    </div>
  `,
  styleUrls: ['./asset-detail.component.scss'],
})
export class AssetDetailComponent {
  @Input() blockchain: string;
  @Input() token: string;
  @Input() tokenLogo: string;

  constructor() {}

}
