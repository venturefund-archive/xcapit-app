import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ApiTicketsService } from '../shared-tickets/services/api-tickets.service';

@Component({
  selector: 'app-create-ticket',
  template: `
    <ion-content class="ion-padding-horizontal ion-padding-bottom">
      <div class="header">
        <div class="header__title">
          <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">
            {{ 'tickets.create.title' | translate }}
          </ion-text>
        </div>
        <div class="header__text">
          <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-14">
            {{ 'tickets.create.text' | translate }}
          </ion-text>
        </div>
      </div>
      <div class="main">
        <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
          <app-ux-input
            controlName="email"
            type="text"
            inputmode="text"
            [label]="'tickets.create.label_email' | translate"
            [placeholder]="'tickets.create.placeholder_email' | translate"
          ></app-ux-input>
          <app-ux-input
            controlName="subject"
            type="text"
            inputmode="text"
            [label]="'tickets.create.label_subject' | translate"
            [placeholder]="'tickets.create.placeholder_subject' | translate"
          ></app-ux-input>
          <app-ux-textarea
            controlName="message"
            inputmode="text"
            [label]="'tickets.create.label_message' | translate"
            [placeholder]="'tickets.create.placeholder_message' | translate"
          ></app-ux-textarea>
          <ion-button
            appTrackClickUnauth
            class="button"
            name="Submit"
            size="medium"
            type="submit"
            color="uxsecondary"
            [disabled]="this.submitButtonService.isDisabled | async"
          >
            {{ 'tickets.create.submit_button' | translate }}
          </ion-button>
        </form>
        <ion-button
          appTrackClickUnauth
          class="button"
          name="Cancel"
          size="medium"
          type="button"
          color="uxsecondary"
          fill="clear"
          (click)="this.close()"
        >
          {{ 'tickets.create.cancel_button' | translate }}
        </ion-button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./create-ticket.page.scss'],
})
export class CreateTicketPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required]],
  });

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private apiTicketsService: ApiTicketsService,
    private navController: NavController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      const extras = this.router.getCurrentNavigation().extras;
      if (extras.state && extras.state.email) {
        this.form.patchValue(extras.state);
      }
    });
  }

  ngOnInit() {}

  handleSubmit() {
    if (this.form.valid) {
      this.createTicket();
    } else {
      this.form.markAllAsTouched();
    }
  }

  createTicket() {
    const data = this.form.value;
    this.apiTicketsService.crud.create(data).subscribe(() => this.success());
  }

  success() {
    this.navController.navigateForward(['/tickets/create/success']);
  }

  close() {
    this.navController.navigateBack(['/users/login']);
  }
}
