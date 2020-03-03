import { Component, OnInit } from '@angular/core';

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
          class="ux-font-lato ux-font-weight-semibold ux-fsize-15"
        >
          {{ 'shared.card_info_robot.action' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./ux-card-info-robot.component.scss']
})
export class UxCardInfoRobotComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  moreInfo() {
    // TODO: Implementar more info
    console.error('More info no implementado');
  }
}
