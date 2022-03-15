import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiTicketsService } from '../shared-tickets/services/api-tickets.service';
@Component({
  selector: 'app-create-ticket',
  template: `
    <ion-content class="ion-padding-horizontal ion-padding-bottom">
      <div class="header">
        <div class="close_button">
          <ion-button fill="clear" appTrackClick name="Close" (click)="this.close()">
            <ion-icon class="main__close_button__icon" name="ux-close" color="neutral80"></ion-icon>
          </ion-button>
        </div>
        <div class="header__title">
          <ion-text class="ux-font-text-lg">
            {{ 'tickets.create.title' | translate }}
          </ion-text>
        </div>
        <div class="header__text">
          <ion-text class="ux-font-text-xs">
            {{ 'tickets.create.text' | translate }}
          </ion-text>
        </div>
      </div>
      <div class="form_component">
        <app-create-ticket-form
          *ngIf="this.userEmail"
          [userEmail]="this.userEmail"
          [emailInput]="true"
          [canModifyEmail]="this.canModifyEmail"
          category="Mi cuenta/Registro"
          (send)="this.handleSubmit($event)"
        ></app-create-ticket-form>
      </div>
    </ion-content>
  `,
  styleUrls: ['./create-email-validation-ticket.page.scss'],
})
export class CreateEmailValidationTicketPage implements OnInit {
  canModifyEmail = true;
  userEmail = '';
  constructor(
    private apiTicketsService: ApiTicketsService,
    private navController: NavController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.userEmail = this.route.snapshot.paramMap.get('email');
    if (this.userEmail) {
      this.canModifyEmail = false;
    }
  }

  handleSubmit(data: any) {
    this.apiTicketsService.crud.create(data).subscribe(
      () => this.success(),
      () => {}
    );
  }

  async success() {
    await this.navController.navigateForward(['/tickets/create/success', true]);
  }

  close() {
    this.navController.navigateBack(['/users/login']);
  }
}
