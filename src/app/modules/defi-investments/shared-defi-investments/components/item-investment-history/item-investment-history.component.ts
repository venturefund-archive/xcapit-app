import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-investment-history',
  template: ` <div class="aiih__content ion-padding">
      <div>
        <ion-icon name="ux-add-amount"></ion-icon>
        <!-- <ion-icon name="ux-withdraw"></ion-icon> -->
      </div>
      <div class="">
        <ion-text class="ux-font-titulo-xs">
          {{ quotation.type }}
        </ion-text>
        <ion-text class="ux-font-text-xxs">
          {{ quotation.date }}
        </ion-text>
      </div>
      <div>
        <ion-text class="ux-font-titulo-xs">
          {{ quotation.amount }}
        </ion-text>
      </div>
    </div>

    <div class="list-divider" *ngIf="!last"></div>`,
  styleUrls: ['./item-investment-history.component.scss'],
})
export class ItemInvestmentHistoryComponent implements OnInit {
  @Input() quotation;
  @Input() last: any;
  isReversed: boolean;

  constructor() {}

  ngOnInit() {
    console.log(this.quotation);
  }
}
