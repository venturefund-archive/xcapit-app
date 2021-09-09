import { Component, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-provider-card',
  template: `
    <div class="pcc" (click)="this.useProvider()">
      <div class="pcc__content">
        <div class="pcc__content__id ">
          <div class="ux-font-text-xxs">
            <ion-text color="uxmedium">0{{ this.provider?.id }}</ion-text>
          </div>
        </div>
        <div class="pcc__content__image">
          <img [src]="this.provider?.logoRoute" alt="Provider Logo" />
        </div>
        <div class="pcc__content__name">
          <div class="ux-font-text-base">
            <ion-text class="name_text" color="uxdark"> {{ this.provider?.name }}</ion-text>
          </div>
        </div>
        <div class="pcc__button">
          <div class="button">
            <ion-button
              appTrackClick
              name="Select"
              fill="clear"
              color="uxsemidark"
              size="small"
              slot="end"
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

  constructor(private navController: NavController) {}

  useProvider() {
    this.navController.navigateForward(this.provider?.newOperationRoute).then();
  }
}
