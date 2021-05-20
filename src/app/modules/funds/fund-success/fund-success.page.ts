import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fund-success',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./fund-success.page.scss'],
})
export class FundSuccessPage implements OnInit {
  data: any;
  isRenew: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.isRenew = this.route.snapshot.paramMap.get('isRenew');
    if (this.isRenew !== 'true') {
      this.data = SUCCESS_TYPES.fund;
    } else {
      this.data = SUCCESS_TYPES.fund_renew;
    }
  }
}
