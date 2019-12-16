import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-binance-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="text-center">
      <img src="assets/img/binance-logo.png" alt="Binance Logo" />
    </div>
  `,
  styleUrls: ['./binance-logo.component.scss']
})
export class BinanceLogoComponent {
  constructor() {}
}
