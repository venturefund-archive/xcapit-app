import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-toast-with-buttons',
  template: `
    <div class="twb">
      <ion-icon
        color="warningdark"
        (click)="this.close()"
        class="twb__close_button"
        name="close-outline"
      ></ion-icon>
      <div class="content">
        <div class="content__icon-warning">
          <ion-icon name="ux-warning-circle-outline" color="warningdark"></ion-icon>
        </div>
        <div class="content__text ux-font-text-xs">
          <ion-text color="warningdark">{{ this.text }}</ion-text>
        </div>
      </div>

      <div class="content__buttons">
        <ion-button
          (click)="this.firstAction()"
          class="ux-link-xl"
          appTrackClick
          name="first_action"
          type="button"
          fill="clear"
        >
          {{ this.firstButtonName }}
        </ion-button>
        <ion-button
          (click)="this.secondaryAction()"
          class="ux-link-xl"
          appTrackClick
          name="secondary_action"
          type="button"
          fill="clear"
        >
          {{ this.secondaryButtonName }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./toast-with-buttons.component.scss'],
})
export class ToastWithButtonsComponent implements OnInit {
  @Input() text: string;
  @Input() firstButtonName: string;
  @Input() secondaryButtonName: string;
  @Input() firstLink: string;
  @Input() secondLink: string;
  @Input() data: any;

  constructor(private modalController: ModalController, private navController: NavController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }

  firstAction() {
    this.close();
    this.navController.navigateForward([this.firstLink]);
  }
  secondaryAction() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: this.data.value,
        network: this.data.network,
      },
    };
    this.close();
    this.navController.navigateForward([this.secondLink], navigationExtras);
  }
}
