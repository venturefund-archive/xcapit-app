import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-support-options-card',
  template: ` <div class="soc" (click)="this.goToOption()">
    <div class="soc__content">
      <div class="soc__content__icon">
        <img [src]="this.option.icon" />
      </div>
      <div class="soc__content__body">
        <div class="soc__content__body__title">
          <div class="ux-font-text-lg">
            <ion-text class="title" color="neutral90"> {{ this.option.title | translate }}</ion-text>
          </div>
        </div>
        <div class="soc__content__body__description">
          <div class="ux-font-text-xxs">
            <ion-text class="description" color="neutral90"> {{ this.option.description | translate }}</ion-text>
          </div>
        </div>
      </div>
      <div class="soc__button">
        <div class="button">
          <ion-button appTrackClick name="Select" fill="clear" color="neutral80" size="small" slot="end">
            <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
          </ion-button>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./support-options-card.component.scss'],
})
export class SupportOptionsCardComponent implements OnInit {
  @Input() option: any;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToOption() {
    this.navController.navigateForward(this.option.route).then();
  }
}
