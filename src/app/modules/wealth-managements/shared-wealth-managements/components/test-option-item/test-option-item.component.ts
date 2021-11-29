import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-test-option-item',
  template: `<div class="toi" (click)="this.goToOption()">
    <div class="toi__content">
      <div class="toi__content__body">
        <div class="toi__content__body__title">
          <div class="ux-font-text-lg">
            <ion-text class="title" color="uxprimary"> {{ this.option.title | translate }}</ion-text>
          </div>
        </div>
        <div class="toi__content__body__description">
          <div class="ux-font-text-xxs">
            <ion-text class="description" color="uxsemidark"> {{ this.option.description | translate }}</ion-text>
          </div>
        </div>
      </div>
      <div class="toi__button">
        <div class="button">
          <ion-button appTrackClick name="Select" fill="clear" size="small" slot="end">
            <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
          </ion-button>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./test-option-item.component.scss'],
})
export class TestOptionItemComponent implements OnInit {
  @Input() option: any;
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToOption() {
    this.navController.navigateForward(this.option.route).then();
  }
}
