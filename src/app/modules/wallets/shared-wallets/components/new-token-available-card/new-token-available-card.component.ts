import { Component, Input, OnInit } from '@angular/core';
import { IonItemGroup } from '@ionic/angular';
import { NETWORK_COLORS } from '../../constants/network-colors.constant';
import { NewToken } from '../../interfaces/new-token.interface';

@Component({
  selector: 'app-new-token-available-card',
  template: `<div class="ntac" (click)="this.openInfoNewTokenModal()">
  <div><img class="ntac__img" [src]="this.newToken.icon" alt="Asset icon" /></div>
  <div class="ntac__content">
    <div class="ntac__content__top">
      <ion-label class="ux-font-lato ux-fsize-14 ux-fweight-bold ntac__content__top__name-label"
        > {{this.newToken.name}}
        <ion-badge
          [color]="this.networkColors[this.newToken.network]"
          class="ux-badge ux-font-num-subtitulo"
          >{{this.newToken.network}}</ion-badge
        >
      </ion-label>
    </div>
    <div class="ntac__content__bottom">
    <ion-badge
          [color]="'secondary'"
          class="ux-badge ux-font-num-subtitulo"
          >Próximamente</ion-badge>
    </div>
  </div>
</div>`,
  styleUrls: ['./new-token-available-card.component.scss'],
})
export class NewTokenAvailableCardComponent implements OnInit {
  @Input() newToken: NewToken;
  networkColors = NETWORK_COLORS;
  constructor() { }

  ngOnInit() {}

  openInfoNewTokenModal() {

  }

}
