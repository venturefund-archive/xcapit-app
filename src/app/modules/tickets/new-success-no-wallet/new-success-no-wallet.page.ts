import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-new-success-no-wallet',
  template: `
    <ion-content class="ion-padding">
      <app-success-content *ngIf="this.data" [data]="this.data"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./new-success-no-wallet.page.scss'],
})
export class NewSuccessNoWalletPage implements OnInit {
  data: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.data = JSON.parse(JSON.stringify(SUCCESS_TYPES.create_ticket_no_wallet))
    const email = this.activatedRoute.snapshot.queryParamMap.get('email')
    this.data.textSecondary = this.translate.instant(this.data.textSecondary, {email})
  }

}
