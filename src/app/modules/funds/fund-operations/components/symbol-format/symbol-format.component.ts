import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-symbol-format',
  template: `
    <ion-text class="base ux-font-text-xxs">{{ this.base }}</ion-text
    ><ion-text color="uxsemidark" class="quote ux-font-text-xxs">/{{ this.quote }}</ion-text>
  `,
  styleUrls: ['./symbol-format.component.scss'],
})
export class SymbolFormatComponent implements OnInit {
  @Input() symbol: string;
  base: string;
  quote: string;

  constructor() {}

  ngOnInit() {
    this.splitSymbol(this.symbol);
  }

  splitSymbol(symbol: string) {
    const array = symbol.split('/');
    this.base = array[0];
    this.quote = array[1];
  }
}
