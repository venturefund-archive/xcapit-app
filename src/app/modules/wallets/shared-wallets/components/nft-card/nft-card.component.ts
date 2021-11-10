import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nft-card',
  template: `
    <div (click)="this.goToDetail()">
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
  constructor() {}

  ngOnInit() {}

  goToDetail() {}
}
