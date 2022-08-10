import { Component, OnInit } from '@angular/core';
import { ApiTicketsService } from '../shared-tickets/services/api-tickets.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../users/shared-users/services/auth/auth.service';
import { NavigationExtras } from '@angular/router';
import { ApiUsuariosService } from '../../users/shared-users/services/api-usuarios/api-usuarios.service';

@Component({
  selector: 'app-create-ticket-suport',
  template: `
    <div class="form_component">
      <app-create-ticket-form *ngIf="this.userEmail" [userEmail]="this.userEmail" (success)="this.success()"></app-create-ticket-form>
    </div>
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
