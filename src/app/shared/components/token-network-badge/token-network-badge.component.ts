import { Component, Input, OnInit } from '@angular/core';
import { NETWORK_COLORS } from '../../../modules/wallets/shared-wallets/constants/network-colors.constant';


@Component({
  selector: 'app-token-network-badge',
  template: `
    <ion-badge [color]="this.networkColors[this.blockchainName]" class="ux-badge ux-font-num-subtitulo">{{
      this.blockchainName | formattedNetwork | uppercase
    }}</ion-badge>
  `,
  styleUrls: ['./token-network-badge.component.scss'],
})
export class TokenNetworkBadgeComponent {
  @Input() blockchainName: string;
  networkColors = NETWORK_COLORS;

  constructor() {}
}
