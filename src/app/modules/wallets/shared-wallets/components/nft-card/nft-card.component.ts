import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NFTMetadata } from '../../interfaces/nft-metadata.interface';
import { NftService } from '../../services/nft-service/nft.service';

@Component({
  selector: 'app-nft-card',
  template: `
    <div class="cnc">
      <div class="cnc__base" *ngIf="this.card === 'base'">
        <ion-text class="cnc__base__title ux-font-text-xxs">
          {{ 'wallets.shared_wallets.claim_nft_card.base' | translate }}
        </ion-text>
        <img class="cnc__base__image" src="assets/img/wallets/growing_rafiki.svg" alt="" />
      </div>

      <div class="cnc__claim" *ngIf="this.card === 'claim'">
        <ion-button class="close_claim" name="Close" size="small" fill="clear" (click)="this.close()">
          <ion-icon name="ux-close"></ion-icon>
        </ion-button>
        <ion-text class="cnc__claim__title ux-font-text-xl">
          {{ 'wallets.shared_wallets.claim_nft_card.title' | translate }}
        </ion-text>
        <ion-text class="cnc__claim__subtitle ux-font-text-base">
          {{ 'wallets.shared_wallets.claim_nft_card.subtitle' | translate }}
        </ion-text>
        <ion-text class="cnc__claim__note ux-font-text-xxs">
          {{ 'wallets.shared_wallets.claim_nft_card.note' | translate }}
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
        <ion-button class="cnc__claim__button-claimed" *ngIf="this.nftStatus === 'claimed'">
          {{ 'wallets.shared_wallets.claim_nft_card.button_claimed' | translate }}
        </ion-button>
      </div>

      <div class="cnc__showNFT ion-padding" (click)="this.goToDetail()" *ngIf="this.card === 'showNFT'">
        <img class="cnc__showNFT__img" [src]="this.NFTdata?.image" />
        <div class="cnc__showNFT__content">
          <ion-text class="ux-font-titulo-xs title" color="uxprimary">{{ this.NFTdata?.name }}</ion-text>
          <ion-text class="ux-font-text-xs subtitle">{{ 'XcapitMexico' }}</ion-text>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./nft-card.component.scss'],
})
export class NftCardComponent implements OnInit {
  card = 'base';
  NFTdata: NFTMetadata;
  @Input() nftStatus = 'unclaimed';
  @Output() nftRequest = new EventEmitter<any>();
  constructor(private navController: NavController, private nftService: NftService) {}

  ngOnInit() {
    this.setCard();
  }

  close() {
    this.card = 'base';
  }

  setCard() {
    if (this.nftStatus === 'delivered') {
      this.getNFTInfo().then(() => {
        if (this.NFTdata) {
          this.card = 'showNFT';
        }
      });
    } else {
      this.card = 'claim';
    }
  }

  createNFTRequest() {
    this.nftRequest.emit();
  }

  getNFTInfo() {
    return this.nftService.getNFTMetadata().then((metadata: NFTMetadata) => {
      this.NFTdata = metadata;
    });
  }

  goToDetail() {
    const navigationExtras: NavigationExtras = {
      state: {
        nftMetadata: this.NFTdata,
      },
    };
    this.navController.navigateForward(['/wallets/nft-detail'], navigationExtras);
  }
}
