import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
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
      <app-nft-card-skeleton *ngIf="!this.card"></app-nft-card-skeleton>
      <div *ngIf="this.card === 'showNFT'">
        <div class="cnc__showNFT ion-padding" (click)="this.goToDetail(nft)" *ngFor="let nft of this.NFTdata" >
          <img class="cnc__showNFT__img" [src]="this.nft?.image" />
          <div class="cnc__showNFT__content">
            <ion-text class="ux-font-titulo-xs title" color="uxprimary">{{ this.nft?.name }}</ion-text>
            <ion-text class="ux-font-text-xs subtitle">{{ 'XcapitMexico' }}</ion-text>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./nft-card.component.scss'],
})
export class NftCardComponent implements OnInit {
  card : string;
  NFTdata: any = [];
  @Input() nftStatus = 'unclaimed';
  @Output() nftRequest = new EventEmitter<any>();
  constructor(private navController: NavController, private nftService: NftService) {}

  ngOnInit() {
    this.setCard();
  }

  setCard() {
    if (this.nftStatus === 'delivered') {
      this.getNFTInfo().then(() => {
       if(this.NFTdata.length > 0){
         this.card = 'showNFT'
       }else{
         this.card = 'base'
        }
      });
    }
  }

  getNFTInfo() {
    return this.nftService.getNFTMetadata().then((metadata) => {
      this.NFTdata = metadata;
    });
  }

  goToDetail(nft) {
    const navigationExtras: NavigationExtras = {
      state: {
        nftMetadata: nft,
      },
    };
    this.navController.navigateForward(['/wallets/nft-detail'], navigationExtras);
  }
}
