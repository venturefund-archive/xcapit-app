import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-create-ticket-success',
  template: `
    <ion-content class="ion-padding">
      <app-success-content
        [data]="this.data"
        [unauth]="true"
      ></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./create-ticket-success.page.scss'],
})
export class CreateTicketSuccessPage implements OnInit {
  data: any;

  constructor() {}

  ngOnInit() {
    this.data = SUCCESS_TYPES.ticket_create;
  }
}
