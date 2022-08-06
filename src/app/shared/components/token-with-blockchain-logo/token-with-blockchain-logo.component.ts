import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-token-with-blockchain-logo',
  template: `
    <div class="twbl__img">
      <img [src]="this.tokenLogo" />
      <img [src]="this.blockchainLogo" />
    </div>
  `,
  styleUrls: ['./token-with-blockchain-logo.component.scss'],
})
export class TokenWithBlockchainLogoComponent implements OnInit {
  @Input() tokenLogo: string;
  @Input() blockchainLogo: string;
  constructor() {}

  ngOnInit() {}
}
