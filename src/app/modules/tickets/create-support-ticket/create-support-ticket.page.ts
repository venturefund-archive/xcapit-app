import { Component, OnInit } from '@angular/core';
import { ApiTicketsService } from '../shared-tickets/services/api-tickets.service';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
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
      <ion-label class="ux-font-text-xs">{{ 'tickets.create_support_ticket.info' | translate }}</ion-label>
      <div class="form_component">
        <app-create-ticket-form
          *ngIf="this.userEmail"
          [userEmail]="this.userEmail"
          (send)="this.handleSubmit($event)"
        ></app-create-ticket-form>
      </div>
    </ion-content>
  `,
  styleUrls: ['./create-support-ticket.page.scss'],
})
export class CreateSupportTicketPage implements OnInit {
  userEmail: any;
  constructor(
    private apiTickets: ApiTicketsService,
    private apiUsuarios: ApiUsuariosService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getUserEmail();
  }

  handleSubmit(data: any) {
    this.apiTickets.crud.create(data).subscribe(() => this.success());
  }

  getUserEmail() {
    this.apiUsuarios.getUser().subscribe((data: any) => (this.userEmail = data.email));
  }

  success() {
    this.navController.navigateForward(['tickets/create/success'], {
      replaceUrl: true,
    });
  }
}
