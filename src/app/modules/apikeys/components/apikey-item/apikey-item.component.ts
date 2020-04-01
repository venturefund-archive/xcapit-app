import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-apikey-item',
  template: `
    <div class="cib ">
      <div class="cib__main">
        <div class="cib__main__content ion-padding">
          <div
            class="cib__main__content__title ux-font-gilroy ux-fweight-extrabold ux-fsize-22"
          >
            <ion-text color="uxdark">{{ this.alias }}</ion-text>
            <ion-button
              appTrackClick
              name="EditButton"
              fill="clear"
              size="small"
              class="cib__buttons__editButton"
            >
              <ion-icon
                class="cib__buttons__icon"
                style="zoom:1.1;"
                name="pencil-sharp"
              ></ion-icon>
            </ion-button>
          </div>
          <div
            class="cib__main__content__text ux-font-lato ux-fweight-regular ux-fsize-14"
          >
            <ion-text>{{
              ('shared.card_apikeys.content' | translate) + this.nombre_bot
            }}</ion-text>
          </div>
        </div>
      </div>

      <div class="cib__footer">
        <ion-button
          appTrackClick
          name="removeButton"
          fill="clear"
          size="small"
          class="cib__footer__buttons__removeButton"
        >
          <ion-icon name="trash-sharp"></ion-icon>
        </ion-button>
        <ion-button
          appTrackClick
          name="Manage"
          fill="clear"
          size="small"
          class="cib__footer__more_info ux-font-lato ux-fweight-semibold ux-fsize-14"
        >
          {{ 'shared.card_apikeys.action' | translate }}
          <ion-icon slot="end" name="ux-forward"></ion-icon>
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./apikey-item.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class ApikeyItemComponent implements OnInit {
  @Input() nombre_bot;
  @Input() alias;
  control: AbstractControl;
  constructor() {}

  ngOnInit() {}
}
