import { Component, OnInit } from '@angular/core';
import { ApiTicketsService } from '../shared-tickets/services/api-tickets.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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
        <ion-text class="ux-font-text-base" color="neutral90">{{
          'tickets.create_support_ticket.info' | translate
        }}</ion-text>
      </div>
      <div class="form_component">
        <app-create-ticket-form [form]="this.form" [emailInput]="true" [canModifyEmail]="true"></app-create-ticket-form>
      </div>
    </ion-content>
    <ion-footer class="footer">
      <div class="footer__submit-button">
        <ion-button
          appTrackClick
          class="footer__submit-button__button ux_button"
          name="Submit"
          size="medium"
          (click)="this.handleSubmit()"
          color="secondary"
          [disabled]="!this.form.valid"
        >
          {{ 'tickets.create_support_ticket.submit_button' | translate }}
        </ion-button>
      </div>
    </ion-footer>
  `,
  styleUrls: ['./create-support-ticket.page.scss'],
})
export class CreateSupportTicketPage implements OnInit {
  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.maxLength(2000)]],
  });

  constructor(
    private apiTickets: ApiTicketsService,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {}

  handleSubmit() {
    if (this.form.valid) {
      const parsedValues = this.getParsedValues(this.form.value);
      this.apiTickets.crud.create(parsedValues).subscribe(() => this.success());
    } else {
      this.form.markAllAsTouched();
    }    
  }

  success() {
    this.navController.navigateForward(['tickets/create/success'], {
      replaceUrl: true,
    });
  }

  getParsedValues(formValues) {
    const valuesCopy = Object.assign({}, formValues);
    valuesCopy.category_code = valuesCopy.subject.name;
    valuesCopy.subject = this.translate.instant(valuesCopy.subject.value);
    return valuesCopy;
  }
}
