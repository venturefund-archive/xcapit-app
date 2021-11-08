import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nft-detail',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="nd__toolbar ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wallets.nft_detail.title' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="content ion-padding">
      <div class="nd ux_main">
        <div class="ux_content">
          <div>
            <img class="nd__image" [src]="this.testNft.nftImage" alt="" />
          </div>
          <div class="nd__title_and_subtitle">
            <ion-text class="nd__title ux-font-text-lg">
              {{ this.testNft.nftName }}
            </ion-text>
            <ion-text class="nd__subtitle ux-font-text-base">
              {{ this.testNft.nftDescription }}
            </ion-text>
          </div>
          <div class="nd__creator">
            <ion-text class="nd__creator__label ux-font-title-xs">
              {{ 'wallets.nft_detail.label1' | translate }}
            </ion-text>
            <div class="nd__creator__logo_and_name">
              <img class="nd__creator__image" [src]="this.testNft.logoCreator" alt="" />
              <ion-text class="nd__creator__name ux-font-text-xs">
                {{ this.testNft.nameCreator }}
              </ion-text>
            </div>
          </div>
          <div class="nd__divider list-divider"></div>
          <div class="nd__chain_info ion-padding">
            <ion-text class="nd__chain_info__label ux-font-title-xs">
              {{ 'wallets.nft_detail.label2' | translate }}
            </ion-text>
            <div>
              <app-item-input-copy
                label="wallets.nft_detail.label_input1"
                [dataInput]="this.testNft.contactAddress"
              ></app-item-input-copy>
              <app-item-input-copy
                label="wallets.nft_detail.label_input2"
                [dataInput]="this.testNft.tokenId"
              ></app-item-input-copy>
              <app-item-input-copy
                [typeBlockchain]="true"
                label="wallets.nft_detail.label_input3"
                [dataInput]="this.testNft.blockchain"
              ></app-item-input-copy>
            </div>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./nft-detail.page.scss'],
})
export class NftDetailPage implements OnInit {
  testNft = {
    id: 1,
    nftName: 'Financial Freedom Mexico',
    nftDescription: 'Mexico celebrates 200 years of independence and Gustavo Abascal interprets freedom',
    nftImage: 'assets/img/prueba/noimage.jpg',
    logoCreator: 'assets/img/prueba/xcapit.png',
    nameCreator: 'Xcapit',
    contactAddress: '0x042841842502d3EAF1946FSADASWQEFVDVCASDWQEQWE',
    tokenId: '2768',
    blockchain: 'Polygon',
  };

  constructor() {}

  ngOnInit() {}
}
