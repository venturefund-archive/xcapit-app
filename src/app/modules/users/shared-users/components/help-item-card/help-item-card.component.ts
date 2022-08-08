import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-help-item-card',
  template: `<div class="hic" appTrackClick name="go_to_item" [dataToTrack]="{ eventLabel: this.item.dataToTrack }" (click)="this.goToItem() ">
  <div class="hic__content ux-card">
    <div class="hic__content__icon">
      <img [src]="this.item.icon" />
    </div>
    <div class="hic__content__body">
      <div class="hic__content__body__title">
        <div class="ux-font-text-lg">
          <ion-text class="title"> {{ this.item.title | translate }}</ion-text>
        </div>
      </div>
      <div class="hic__content__body__description">
        <div class="ux-font-text-xxs">
          <ion-text class="description"> {{ this.item.description | translate }}</ion-text>
        </div>
      </div>
    </div>
    <div class="hic__button ion-no-padding">
        <ion-button name="Select" fill="clear" size="medium" slot="end">
          <ion-icon slot="end" name="chevron-forward-outline" class="chevron"></ion-icon>
        </ion-button>
    </div>
  </div>
</div>`,
  styleUrls: ['./help-item-card.component.scss'],
})
export class HelpItemCardComponent implements OnInit {

  @Input() item: any;
  constructor(private navController: NavController) { }

  ngOnInit() {}

  goToItem() {
    this.navController.navigateForward(this.item.route);
  }
}
