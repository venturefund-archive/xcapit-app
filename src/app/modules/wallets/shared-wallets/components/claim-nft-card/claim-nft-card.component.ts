import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-claim-nft-card',
  template: `
    <div class="cnc">
      <div class="cnc__base" *ngIf="!this.showClaimMessage">
        <ion-text class="cnc__base__title ux-font-text-xxs">
          {{ 'wallets.shared_wallets.claim_nft_card.base' | translate }}
        </ion-text>
        <img class="cnc__base__image" src="assets/img/wallets/growing_rafiki.svg" alt="" />
      </div>
      <div class="cnc__claim" *ngIf="this.showClaimMessage">
        <ion-button class="close_claim" name="Close" size="small" fill="clear" (click)="this.close()">
          <ion-icon name="ux-close"></ion-icon>
        </ion-button>
        <ion-text class="cnc__claim__title ux-font-text-xl">
          {{
            (this.nftStatus === 'claimed'
              ? 'wallets.shared_wallets.claim_nft_card.claimed_title'
              : 'wallets.shared_wallets.claim_nft_card.unclaimed_title'
            ) | translate
          }}
        </ion-text>
        <ion-text class="cnc__claim__subtitle ux-font-text-base">
          {{
            (this.nftStatus === 'claimed'
              ? 'wallets.shared_wallets.claim_nft_card.claimed_subtitle'
              : 'wallets.shared_wallets.claim_nft_card.unclaimed_subtitle'
            ) | translate
          }}
        </ion-text>
        <ion-text class="cnc__claim__note ux-font-text-xxs">
          {{
            (this.nftStatus === 'claimed'
              ? 'wallets.shared_wallets.claim_nft_card.claimed_note'
              : 'wallets.shared_wallets.claim_nft_card.unclaimed_note'
            ) | translate
          }}
        </ion-text>
        <ion-button
          appTrackClick
          name="Claim"
          class="cnc__claim__button-claim"
          (click)="this.createNFTRequest()"
          *ngIf="this.nftStatus === 'unclaimed'"
        >
          {{ 'wallets.shared_wallets.claim_nft_card.button_claim' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./claim-nft-card.component.scss'],
})
export class ClaimNftCardComponent implements OnInit {
  showClaimMessage = true;
  @Input() nftStatus = 'unclaimed';
  @Output() nftRequest = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}

  close() {
    this.showClaimMessage = false;
  }

  createNFTRequest() {
    if (this.nftStatus === 'unclaimed') {
      this.nftRequest.emit();
    }
  }
}
