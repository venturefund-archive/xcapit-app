import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallet-advice',
  template: `
    <div class="wa">
      <div class="wa__image">
        <ion-icon class="image" size="medium" [name]="this.logo" color="uxprimary" slot="start"></ion-icon>
      </div>
      <div class="wa__text">
      <span class="ux-font-text-xs text">
            {{ this.text | translate }}
            <ion-button
              name="go_to_wallet_faqs"
              class="ux-link-xs wa__text__button"
              (click)="this.goToWalletTerms()"
              appTrackClick
              fill="clear"
            >
              {{ this.link | translate }}
            </ion-button>
          </span>
      </div>
    </div>
  `,
  styleUrls: ['./wallet-advice.component.scss'],
})
export class WalletAdviceComponent implements OnInit {
  @Input() logo: string;
  @Input() text: string;
  @Input() link: string;
  constructor(private navController : NavController) {}

  ngOnInit() {}

  goToWalletTerms(){
    this.navController.navigateForward(['support/wallet'])
  }
}
