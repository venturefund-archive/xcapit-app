import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-failed-mnemonic',
  template: `
    <ion-content class="ion-padding failed-mnemonic-content">
      <app-success-content [data]="this.data" imageName="ux-error.svg" imageAlt="Error Image"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./failed-mnemonic.page.scss'],
})
export class FailedMnemonicPage implements OnInit {
  data: any;
  constructor() {}

  ngOnInit() {
    this.data = SUCCESS_TYPES.unsuccesful_mnemonic_verification;
  }
}
