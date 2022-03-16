import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NFT } from '../../models/nft/nft.class';
import { UrlImageOf } from '../../models/nft/url-image-of.class';
import { NftService } from '../../services/nft-service/nft.service';

@Component({
  selector: 'app-nft-card',
  template: `
    <div class="cnc">
      <div class="cnc__base" *ngIf="this.cardState === 'base'">
        <ion-text class="cnc__base__title ux-font-text-xxs">
          {{ 'wallets.shared_wallets.claim_nft_card.base' | translate }}
        </ion-text>
        <img class="cnc__base__image" src="assets/img/wallets/growing_rafiki.svg" alt="" />
      </div>
      <app-nft-card-skeleton *ngIf="!this.cardState"></app-nft-card-skeleton>
      <div *ngIf="this.cardState === 'showNFT'">
        <div class="cnc__showNFT ion-padding" (click)="this.goToDetail(nft?.nftObject)" *ngFor="let nft of this.nftsTemplateData" >
          <img class="cnc__showNFT__img" [src]="this.nft?.image" />
          <div class="cnc__showNFT__content">
            <ion-text class="ux-font-titulo-xs title" color="primary">{{ this.nft?.name }}</ion-text>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./nft-card.component.scss'],
})
export class NftCardComponent implements OnInit {
  cardState : string;
  userNFTs: NFT[] = [];
  nftsTemplateData: any[] = []
  constructor(private navController: NavController, private nftService: NftService) {}

  async ngOnInit() {
      await this.loadNFTs();
      this.setNFTsTemplateData();
      this.setCardState();
  }

    private setCardState() {
        this.cardState = this.userNFTs.length > 0 ? 'showNFT' : 'base';
    }

    private async loadNFTs() {
        this.userNFTs = await this.nftService.xcapitNFTs();
    }

    private setNFTsTemplateData() {
        this.nftsTemplateData = [];
        for (const nft of this.userNFTs) {
            this.nftsTemplateData.push({ name: nft.name(), image: (new UrlImageOf(nft)).value(), nftObject: nft });
            }
    }

    goToDetail(nft: NFT) {
    const navigationExtras: NavigationExtras = { state: { nft } };
    this.navController.navigateForward(['/wallets/nft-detail'], navigationExtras);
  }
}
