import { Component, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-provider-card',
  template: `
    <div class="pcc" (click)="this.useProvider()">
      <div class="pcc__content">
        <div class="pcc__content__id ">
          <div class="ux-font-lato ux-fweight-regular ux-fsize-12">
            <ion-text color="uxmedium">0{{ this.provider?.id }}</ion-text>
          </div>
        </div>
        <div class="pcc__content__image">
          <img [src]="this.provider?.logoRoute" alt="Provider Logo" />
        </div>
        <div class="pcc__content__name">
          <div class="ux-font-lato ux-fweight-regular ux-fsize-12">
            <ion-text class="name_text" color="uxdark"> {{ this.provider?.name }}</ion-text>
          </div>
        </div>
        <div class="pcc__button">
          <div class="button">
            <ion-button
              appTrackClick
              name="Select"
              fill="clear"
              color="uxmedium"
              size="small"
              slot="end"
              class="ux-font-lato ux-fweight-semibold ux-fsize-14"
              (click)="this.useProvider()"
            >
              <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
            </ion-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./provider-card.component.scss'],
})
export class ProviderCardComponent {
  @Input() provider: any;

  constructor(private navController: NavController, private storage: Storage) {}

  useProvider() {
    this.storage.set('provider-crypto', this.provider.name);
    this.navController.navigateForward(this.provider?.newOperationRoute).then();
  }
}
