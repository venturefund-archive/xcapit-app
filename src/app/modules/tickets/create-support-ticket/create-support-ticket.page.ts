import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ApiUsuariosService } from '../../users/shared-users/services/api-usuarios/api-usuarios.service';

@Component({
  selector: 'app-create-ticket-support',
  template: `
    <ion-content class="form_component">
      <app-create-ticket-form *ngIf="this.userEmail" [userEmail]="this.userEmail" (success)="this.success()"></app-create-ticket-form>
    </ion-content>
  `,
  styleUrls: ['./create-support-ticket.page.scss'],
})
export class CreateSupportTicketPage implements OnInit {
  isLoggedIn: boolean;
  userEmail: string;

  constructor(
    private navController: NavController,
    private apiUsuarios: ApiUsuariosService,
    ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getUserEmail();
  }

  getUserEmail() {
    this.apiUsuarios.getUser().subscribe((data: any) => (this.userEmail = data.email));
  }

  success() {
    const navigationExtras: NavigationExtras = {
      replaceUrl: true,
    };

    this.navController.navigateForward(['tickets/success'], navigationExtras);
  }

  
}
