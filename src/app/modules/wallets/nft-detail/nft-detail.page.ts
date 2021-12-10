import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Navigation, Router } from '@angular/router';
import { NFTMetadata } from '../shared-wallets/interfaces/nft-metadata.interface';
import { NFT } from '../shared-wallets/interfaces/nft.interface';
import { NftService } from '../shared-wallets/services/nft-service/nft.service';

@Component({
  selector: 'app-nft-detail',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="nd__toolbar ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/investments/binance"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wallets.nft_detail.title' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="content ion-padding">
      <div class="nd ux_main">
        <div class="ux_content">
          <div>
            <img class="nd__image" [src]="this.NFTMetadata?.image" alt="" />
          </div>
          <div class="nd__title_and_subtitle">
            <ion-text class="nd__title ux-font-text-lg">
              {{ this.NFTMetadata?.name }}
            </ion-text>
            <ion-text class="nd__subtitle ux-font-text-base">
              {{ this.NFTMetadata?.description }}
            </ion-text>
          </div>
          <div class="nd__creator">
            <ion-text class="nd__creator__label ux-font-title-xs">
              {{ 'wallets.nft_detail.label1' | translate }}
            </ion-text>
            <div class="nd__creator__logo_and_name">
              <img class="nd__creator__image" src="assets/img/nft-detail/xcapit.png" alt="" />
              <ion-text class="nd__creator__name ux-font-text-xs">
                {{ 'Xcapit' }}
              </ion-text>
            </div>
          </div>
          <div class="nd__divider list-divider"></div>
          <div class="nd__chain_info ion-padding">
            <ion-text class="nd__chain_info__label ux-font-title-xs">
              {{ 'wallets.nft_detail.label2' | translate }}
            </ion-text>
            <div>
              <form [formGroup]="this.form" class="ux_main">
                <app-ux-input
                  [label]="'wallets.nft_detail.label_input1' | translate"
                  controlName="contractAddress"
                  [readonly]="true"
                  [copyType]="true"
                  inputmode="text"
                ></app-ux-input>
                <app-ux-input
                  [label]="'wallets.nft_detail.label_input2' | translate"
                  controlName="tokenID"
                  [readonly]="true"
                  [copyType]="true"
                  inputmode="text"
                ></app-ux-input>
                <app-ux-input
                  [label]="'wallets.nft_detail.label_input3' | translate"
                  leftIcon="assets/img/nft-detail/polygon.svg"
                  controlName="blockchain"
                  [readonly]="true"
                  [copyType]="false"
                  inputmode="text"
                ></app-ux-input>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./nft-detail.page.scss'],
})
export class NftDetailPage {
  NFTMetadata: NFTMetadata;
  NFT: NFT;
  nav: Navigation;
  form: FormGroup = this.formBuilder.group({
    contractAddress: [''],
    tokenID: [''],
    blockchain: [''],
  });

  constructor(private formBuilder: FormBuilder, private nftService: NftService, private router: Router) {
    this.nav = this.router.getCurrentNavigation();
  }

  ionViewWillEnter() {
    this.getContractAddress();
    this.getNFTInfo();
  }

  getNFTInfo() {
    if (this.nav.extras && this.nav.extras.state && this.nav.extras.state.nftMetadata) {
      this.NFTMetadata = this.nav.extras.state.nftMetadata as NFTMetadata;
      this.setFormValue();
    } else {
      this.nftService.getNFTMetadata().then((metadata: NFTMetadata) => {
        this.NFTMetadata = metadata;
        this.setFormValue();
      });
    }
  }

  getContractAddress() {
    this.NFT = this.nftService.getNFTMexico();
  }

  setFormValue() {
    this.form.patchValue({
      contractAddress: this.NFT.contractAddress,
      tokenID: this.NFTMetadata.tokenID,
      blockchain: 'Polygon',
    });
    this.form.markAllAsTouched();
  }
}
