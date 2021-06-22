import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-ticket-success',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data" [unauth]="this.unauth"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./create-ticket-success.page.scss'],
})
export class CreateTicketSuccessPage implements OnInit {
  data: any;
  unauth: boolean;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    if (!this.route.snapshot.paramMap.get('isEmailValidation')) {
      this.data = SUCCESS_TYPES.generic_ticket_create;
      this.unauth = false;
    } else {
      this.data = SUCCESS_TYPES.ticket_email_validation_create;
      this.unauth = true;
    }
  }
}
