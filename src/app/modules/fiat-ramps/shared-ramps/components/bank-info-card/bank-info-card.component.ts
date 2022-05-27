import { Component, Input, OnInit } from '@angular/core';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';

@Component({
  selector: 'app-bank-info-card',
  template: `<div></div>`,
  styleUrls: ['./bank-info-card.component.scss'],
})
export class BankInfoCardComponent implements OnInit {
  @Input() provider: FiatRampProvider;

  constructor() { }

  ngOnInit() {}

}
