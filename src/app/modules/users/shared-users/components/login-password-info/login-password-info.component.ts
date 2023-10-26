import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login-password-info',
  template: `
      <div class="lmi">
        <div class="lmi__img-container">
          <div class="lmi__close_button">
            <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
              <ion-icon class="lmi__close_button__icon" name="ux-close" color="primary"></ion-icon>
            </ion-button>
          </div>
          <img class="lmi__img-container__img" [src]="this.image" />
        </div>
        <div class="lmi__title ion-padding ux-font-text-xl">
          <ion-text>{{ this.title | translate }}</ion-text>
        </div>
        <div class="lmi__subtitle ux-font-text-base">
          <ion-text>{{
            this.subtitle
              | translate
          }}</ion-text>
        </div>
        <div class="lmi__footer ion-padding-start ion-padding-end ux_footer">
          <ion-button
            class="ux_button"
            type="button"
            color="secondary"
            expand="block"
            size="large"
            (click)="this.close()"
            appTrackClick
          >
            {{ this.button | translate }}
          </ion-button>
        </div>
      </div>
  `,
  styleUrls: ['./login-password-info.component.scss'],
})
export class LoginPasswordInfoComponent implements OnInit {
  constructor(private modalController: ModalController) {}
  @Input() title : string;
  @Input()  subtitle: string;
  @Input()  image: string;
  @Input() button : string;
  
  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
 
}
