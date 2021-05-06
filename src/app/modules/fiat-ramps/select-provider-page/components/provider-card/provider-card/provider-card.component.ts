import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-provider-card',
  template:`
      <div class="pcc">
        <div class="pcc__content">
          <div class="pcc__content__id ">
            <div class="ux-font-lato ux-fweight-regular ux-fsize-12">
              <ion-text color="uxmedium">0{{ this.provider?.id}}</ion-text>
            </div>
          </div>
          <div class="pcc__content__image">
                <img [src]="this.provider?.img" alt=" Provider Logo" />
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
                color = "uxmedium"
                size="small"
                slot="end"
                class="ux-font-lato ux-fweight-semibold ux-fsize-14"
                (click)="this.useProvider(this.provider?.id)"
              >
              <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
            </ion-button>
          </div>
          </div>
      </div>
  `,
  styleUrls: ['./provider-card.component.scss'],
})
export class ProviderCardComponent implements OnInit {
  @Input() provider: any;
  
  constructor(
    private navController: NavController,
  ) { }

  ngOnInit() {}

  useProvider() {
    this.navController.navigateForward(this.provider?.route).then();
  }
}
