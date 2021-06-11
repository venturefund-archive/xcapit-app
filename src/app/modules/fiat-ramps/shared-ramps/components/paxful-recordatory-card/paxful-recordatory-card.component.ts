import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paxful-recordatory-card',
  template: ` <div class="style-atention pcc_content">
    <div class="pcc_content__important">
      <div class="pcc_content__important__image">
        <img class="pcc_content__important__image__img" [src]="'../assets/img/alerts/atention.svg'" alt="Toast Logo" />
      </div>
      <div class="pcc_content__important__title ">
        <div class="ux-font-lato ux-fweight-bold ux-fsize-14">
          <ion-text class="text">{{ 'fiat_ramps.paxful.recordatory_title' | translate }}</ion-text>
        </div>
      </div>
    </div>
    <div class="pcc_content__message">
      <div class="ux-font-lato ux-fweight-regular ux-fsize-16">
        <ion-text class="text" color="uxdark">{{ 'fiat_ramps.paxful.recordatory_info' | translate }}</ion-text>
      </div>
    </div>
  </div>`,
  styleUrls: ['./paxful-recordatory-card.component.scss'],
})
export class PaxfulRecordatoryCardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
