import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { NETWORK_COLORS } from '../../constants/network-colors.constant';
import { NewToken } from '../../interfaces/new-token.interface';
import { NewTokenInfoModalComponent } from '../new-token-info-modal/new-token-info-modal.component';

@Component({
  selector: 'app-new-token-available-card',
  template: `<div class="ntac" (click)="this.openNewTokenInfoModal()">
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
          >{{'wallets.shared_wallets.new_token_available_card.coming_soon' | translate }}</ion-badge>
    </div>
  </div>
</div>`,
  styleUrls: ['./new-token-available-card.component.scss'],
})
export class NewTokenAvailableCardComponent implements OnInit {
  @Input() newToken: NewToken;
  networkColors = NETWORK_COLORS;
  constructor(private modalController: ModalController,
    private translate: TranslateService,) { }

  ngOnInit() {}

  async openNewTokenInfoModal() {
    const modal = await this.modalController.create({
      component: NewTokenInfoModalComponent,
      showBackdrop: false,
      cssClass: 'modal-info',
      componentProps: {
        title: 'wallets.shared_wallets.new_token_info-modal.title',
        subtitle: this.translate.instant('wallets.shared_wallets.new_token_info-modal.subtitle'),
        image: 'assets/img/wallets/solana-info.svg',
      },
    });
    modal.present();

  }

}
