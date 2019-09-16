import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fund-balance-detail',
  template: `
    <ion-grid>
      <ion-row
        *ngFor="let item of this.detail"
        class="ion-align-items-center"
      >
        <ion-col size="6">
          {{ item.ca + ':' }}
        </ion-col>
        <ion-col>
          {{ item.amount | number: '1.2-4' }}
          {{ ' / ' }}
          {{ item.value | number: '1.2-6' }}
          {{ ' ' }} {{ this.currency }}
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styleUrls: ['./fund-balance-detail.component.scss']
})
export class FundBalanceDetailComponent implements OnInit {

  @Input()
  detail: any[];

  @Input()
  currency: string;

  constructor() {}

  ngOnInit() {}
}
