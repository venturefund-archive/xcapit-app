import { Component, Input, OnInit } from '@angular/core';
import { AssetBalance } from '../../interfaces/asset-balance.interface';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallet-balance-card',
  template: `
    <div class="wbc">


    </div>
  `,
  styleUrls: ['./wallet-balance-card.component.scss'],
})
export class WalletBalanceCardComponent implements OnInit {
  @Input() balances: AssetBalance[];
  constructor(private navController: NavController) {}

  ngOnInit() {}


}
