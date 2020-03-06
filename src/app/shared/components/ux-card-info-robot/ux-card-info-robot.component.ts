import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ux-card-info-robot',
  template: `
    <div class="cir ion-padding">
      <div
        class="cir__title ux-font-gilroy ux-fweight-extrabold ux-fsize-22 ion-text-center"
      >
        <ion-text>{{ 'shared.card_info_robot.title' | translate }}</ion-text>
      </div>
      <div
        class="cir__content ux-font-lato ux-fweight-semibold ux-fsize-14 ion-text-center"
      >
        <ion-text>{{ 'shared.card_info_robot.content' | translate }}</ion-text>
      </div>
      <div class="cir__action">
        <ion-button
          appTrackClick
          name="More Info"
          (click)="this.moreInfo()"
          expand="block"
          class="ux_button"
        >
          {{ 'shared.card_info_robot.action' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./ux-card-info-robot.component.scss']
})
export class UxCardInfoRobotComponent implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  moreInfo() {
    this.navController.navigateForward('tutorials/help');
  }

}
