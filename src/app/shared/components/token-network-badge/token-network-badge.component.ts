import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-token-network-badge',
  template: `
    <ion-badge [color]="this.networkColors[this.tplBlockchain.name]" class="ux-badge ux-font-num-subtitulo">{{
      this.tplBlockchain.name | formattedNetwork | uppercase
    }}</ion-badge>
  `,
  styleUrls: ['./token-network-badge.component.scss'],
})
export class TokenNetworkBadgeComponent implements OnInit {
  @Input() blockchainName: string;
  constructor() {}

  ngOnInit() {}
}
