import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-app-modal',
  template: `
    <div class="ion-padding uam__content">
      <div class="uam__content__button-close">
        <ion-button fill="clear" color="neutral80" size="medium" class="ion-no-padding ion-no-margin">
          <ion-icon name="ux-close"></ion-icon>
        </ion-button>
      </div>
      <div class="uam__content__title">
        <ion-text class="ux-font-text-xl">
          {{ 'shared.update_modal.title' | translate }}
        </ion-text>
      </div>
      <div class="uam__content__text">
        <ion-text class="ux-font-text-base">
          {{ 'shared.update_modal.text' | translate }}
        </ion-text>
      </div>
      <div class="uam__content__button-primary">
        <ion-button class="ux_button ion-no-padding ion-no-margin" color="secondary" expand="block">
          {{ 'shared.update_modal.button_primary' | translate }}
        </ion-button>
      </div>
      <div class="uam__content__button-secondary">
        <ion-button class="ux_button ion-no-padding ion-no-margin" color="info" fill="clear" expand="block">
          {{ 'shared.update_modal.button_secondary' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./update-app-modal.component.scss'],
})
export class UpdateAppModalComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
