import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paxful-recordatory-card',
  template: ` <div class="style-atention pcc_content">
    <div class="pcc_content__important">
      <div class="pcc_content__important__image">
        <img
          class="pcc_content__important__image__img"
          [src]="'../assets/img/alerts/information.svg'"
          alt="Toast Logo"
        />
      </div>
      <div class="pcc_content__important__title ">
        <div class="ux-font-text-xs">
          <ion-text class="text" color="uxdark">{{ 'fiat_ramps.paxful.recordatory_info' | translate }}</ion-text>
        </div>
      </div>
    </div>
    <!--    <div class="pcc_content__message">-->
    <!--      <div class="ux-font-text-base">-->
    <!--        <ion-text class="text" color="uxdark">{{ 'fiat_ramps.paxful.recordatory_info' | translate }}</ion-text>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>`,
  styleUrls: ['./paxful-recordatory-card.component.scss'],
})
export class PaxfulRecordatoryCardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
