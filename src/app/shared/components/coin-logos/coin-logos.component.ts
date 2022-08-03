import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-coin-logos',
  template: `
    <div class="cl__img">
      <img [src]="this.tokenLogo" />
      <img [src]="this.nativeTokenLogo" />
    </div>
  `,
  styleUrls: ['./coin-logos.component.scss'],
})
export class CoinLogosComponent implements OnInit {
  @Input() tokenLogo: string;
  @Input() nativeTokenLogo: string;
  constructor() {}

  ngOnInit() {}
}
