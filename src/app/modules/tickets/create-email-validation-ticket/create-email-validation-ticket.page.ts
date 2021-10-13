import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ApiTicketsService } from '../shared-tickets/services/api-tickets.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-ticket',
  template: `
    <ion-content class="ion-padding-horizontal ion-padding-bottom">
      <div class="header">
        <div class="header__title">
          <ion-text class="ux-font-text-xl">
            {{ 'tickets.create.title' | translate }}
          </ion-text>
        </div>
        <div class="header__text">
          <ion-text class="ux-font-text-xl">
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
          [category]="this.validationCategory"
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
  validationCategory = '';
  constructor(
    public submitButtonService: SubmitButtonService,
    private apiTicketsService: ApiTicketsService,
    private navController: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    this.route.queryParams.subscribe((params) => {
      const extras = this.router.getCurrentNavigation().extras;
      if (extras.state && extras.state.email) {
        this.userEmail = extras.state.email;
        this.canModifyEmail = false;
      }
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.validationCategory = this.translate.instant(`tickets.categories.email_validation`);
  }

  handleSubmit(data: any) {
    this.apiTicketsService.crud.create(data).subscribe(() => this.success());
  }

  async success() {
    await this.navController.navigateForward(['/tickets/create/success', true]);
  }

  close() {
    this.navController.navigateBack(['/users/login']);
  }
}
