import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-nft-card',
  template: `
    <div name="Go To Detail" (click)="this.goToDetail()">
      <div class="nv ion-padding">
        <img class="nv__img" [src]="this.data?.image" />
        <div class="nv__content">
          <ion-text class="ux-font-titulos-xs title" color="uxprimary">{{ this.data?.name }}</ion-text>
          <ion-text class="ux-font-text-xs subtitle">{{ 'XcapitMexico' }}</ion-text>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./nft-card.component.scss'],
})
export class NftCardComponent implements OnInit {
  @Input() data;
  constructor(private navContrller: NavController) {}

  ngOnInit() {}

  goToDetail() {
    this.navContrller.navigateForward(['/wallets/nft-detail']);
  }
}
