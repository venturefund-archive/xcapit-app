import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-swap-in-progress',
  template: ` <ion-content class="ion-padding">
  <app-success-content [data]="this.data"></app-success-content>
</ion-content>`,
  styleUrls: ['./swap-in-progress.page.scss'],
})
export class SwapInProgressPage implements OnInit {
  data = SUCCESS_TYPES.swap_in_progress;
  constructor() { }

  ngOnInit() {
  }

}
