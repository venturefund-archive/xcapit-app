import { Component, OnInit } from '@angular/core';
import { ApiTicketsService } from '../shared-tickets/services/api-tickets.service';
import { ApiUsuariosService } from '../../users/shared-users/services/api-usuarios/api-usuarios.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-ticket-suport',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <div>
          <ion-title class="fd__header-title ion-text-center">{{
            'tickets.create_support_ticket.header' | translate
          }}</ion-title>
        </div>
        <div class="fd__header-button"></div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="title">
        <ion-text class="ux-font-text-lg">{{ 'tickets.create_support_ticket.title' | translate }}</ion-text>
      </div>
      <div class="info">
        <ion-text class="ux-font-text-base" color="neutral90">{{ 'tickets.create_support_ticket.info' | translate }}</ion-text>
      </div>
      <div class="form_component">
        <app-create-ticket-form [emailInput]="true" (send)="this.handleSubmit($event)"></app-create-ticket-form>
      </div>
    </ion-content>
    <ion-footer class="footer">
      <div class="footer__submit-button">
        <ion-button appTrackClick class="footer__submit-button__button ux_button" name="Submit" size="medium" type="submit" color="secondary">
          {{ 'tickets.create_support_ticket.submit_button' | translate }}
        </ion-button>
      </div>
    </ion-footer>
  `,
  styleUrls: ['./create-support-ticket.page.scss'],
})
export class CreateSupportTicketPage implements OnInit {
  constructor(private apiTickets: ApiTicketsService, private navController: NavController) {}

  ngOnInit() {}

  ionViewWillEnter() {}

  handleSubmit(data: any) {
    this.apiTickets.crud.create(data).subscribe(() => this.success());
  }

  success() {
    this.navController.navigateForward(['tickets/create/success'], {
      replaceUrl: true,
    });
  }
}
