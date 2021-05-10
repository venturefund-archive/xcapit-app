import { Component, Input, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;
@Component({
  selector: 'app-method',
  template: `
  <div class="mc">
        <div class="mc__content">
          <div class="mc__content__both">
            <div class="mc__content__img">
              <ion-img [src]="this.paymentMethods?.img"></ion-img>  
            </div>
            <div class="mc__content__name">
              <div class="ux-font-lato ux-fweight-regular ux-fsize-22">
                <ion-text>{{ this.paymentMethods?.name }} <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-14"color="uxmedium">{{this.paymentMethods?.description}}</ion-text></ion-text>
              </div>
            </div>
          </div>
          <div class="mc__content__button">
            <div class="button">
              <ion-button
                appTrackClick
                name="method"
                fill="clear"
                color = "uxmedium"
                size="small"
                slot="end"
                class="ux-font-lato ux-fweight-semibold ux-fsize-14"
                (click)="openLink()"
              >
              <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
            </ion-button>
          </div>
          </div>
      </div>
  `,
  styleUrls: ['./method.component.scss'],
})
export class MethodComponent implements OnInit {
  @Input() paymentMethods: any;

  constructor() { }

  ngOnInit() { }

  openLink() {
    if(this.paymentMethods.link){
      Browser.open({
        toolbarColor: 'red',
        url: this.paymentMethods.link,
      });
    }
  }
}