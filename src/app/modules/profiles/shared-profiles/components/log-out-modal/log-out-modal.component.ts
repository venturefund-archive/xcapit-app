import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-out-modal',
  template: `
  <div class="ux-card lom">
    <div class="ion-padding lom__content">
      <div class="lom__content__title">
        <ion-text class="ux-font-text-lg">Titulo</ion-text>
      </div>
      <div class="lom__content__text">
        <ion-text class="ux-font-text-base">Texto</ion-text>
      </div>
      <div class="lom__content__more-info">
        <ion-text class="ux-font-text-base">Texto2</ion-text><br>
        <ion-button class="ux-link-xs ion-no-padding ion-no-margin" fill="clear">
          Link
        </ion-button>
      </div>
      <div class="lom__content__checkbox">
        <ion-item class="ion-no-padding ion-no-margin" lines="none">
          <ion-checkbox mode="md" slot="start"></ion-checkbox>
          <ion-label class="ux-font-text-base">No volver</ion-label>
        </ion-item>
      </div>
    </div>
    <div class="lom__close-button">
      <ion-button class="ux_button" fill="clear">Cerrar</ion-button>
    </div>
  </div>
  `,
  styleUrls: ['./log-out-modal.component.scss'],
})
export class LogOutModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
