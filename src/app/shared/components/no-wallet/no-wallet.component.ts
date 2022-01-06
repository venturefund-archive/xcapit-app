import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-no-wallet',
  template: `
    <div class="main">
      <div class="main__button_content">
        <ion-button class="main__close_button" appTrackClick fill="clear" name="Close" (click)="this.close()">
          <ion-icon class="main__close_button__icon" name="ux-close" color="uxsemidark"></ion-icon>
        </ion-button>
      </div>
      <div class="main__image">
        <img [src]="this.data?.img" />
      </div>
      <div class="main__primary_text ux-font-text-xl">
        <ion-text>{{ this.data?.title | translate }}</ion-text>
      </div>
      <div class="main__secondary_text ux-font-text-base">
        <ion-text>{{ this.data?.subtitle | translate }}</ion-text>
      </div>
      <div class="main__button">
        <div class="main__button__wallet">
          <ion-button appTrackClick color="uxsecondary" class="ux_button" name="Go To Page" (click)="this.goToPage()">
            {{ this.data?.nameButton | translate }}
          </ion-button>
          <div>
            <ion-button fill="clear" appTrackClick class="ux-link-xl" name="Go To Link" (click)="this.goToLink()">
              {{ this.data?.nameLink | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./no-wallet.component.scss'],
})
export class NoWalletComponent implements OnInit {
  @Input() data: any;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  close() {
    this.navController.navigateBack([this.data.urlClose]);
  }

  goToPage() {
    this.navController.navigateForward([this.data.urlPage]);
  }

  goToLink() {
    this.navController.navigateForward([this.data.urlLink]);
  }
}
