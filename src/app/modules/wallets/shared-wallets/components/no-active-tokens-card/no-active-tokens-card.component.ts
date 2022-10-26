import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-no-active-tokens-card',
  template: `
    <div class="nat">
      <ion-text class="ux-font-text-lg nat__title" name="Title">{{
        this.title | translate
      }}</ion-text>
      <img src="assets/img/wallets/no-tokens-selected.svg" />
      <ion-button
        name="Activate"
        expand="block"
        size="large"
        class="ux_button nat__button"
        color="secondary"
        (click)="this.goToSelectCoins()"
      >
        {{ 'wallets.shared_wallets.no_active_tokens_card.button' | translate }}
      </ion-button>
    </div>
  `,
  styleUrls: ['./no-active-tokens-card.component.scss'],
})
export class NoActiveTokensCardComponent implements OnInit {
  @Input() operation: string;
  title: string;
  constructor(
    private navController: NavController,
  ) {}

  ngOnInit() {
    this.setText()
  }

  goToSelectCoins(): void {
    this.navController.navigateForward(['wallets/select-coins', 'edit']);
  }

  setText() {
    switch(this.operation) {
      case 'send': {
        this.title = 'wallets.shared_wallets.no_active_tokens_card.title.send'
        break;
      }
      case 'receive': {
        this.title = 'wallets.shared_wallets.no_active_tokens_card.title.receive'
        break;
      }
    }
  }
}
