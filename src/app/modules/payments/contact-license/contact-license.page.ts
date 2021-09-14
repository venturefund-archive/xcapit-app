import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ApiProfilesService } from '../../profiles/shared-profiles/services/api-profiles/api-profiles.service';
import { ApiTicketsService } from '../../tickets/shared-tickets/services/api-tickets.service';

@Component({
  selector: 'app-contact-license',
  template: `
    <ion-content class="ion-padding-horizontal ion-padding-bottom">
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <div class="ux_content">
          <div class="header">
            <div class="header__title">
              <ion-text class="ux-font-text-xl">
                {{ 'payment.contact.title' | translate }}
              </ion-text>
            </div>
            <div class="header__text">
              <ion-text class="ux-font-text-xs">
                {{ 'payment.contact.textPrimary' | translate }}
              </ion-text>
            </div>
          </div>
          <app-ux-input
            controlName="email"
            name="email"
            type="text"
            inputmode="text"
            [label]="'payment.contact.label_email' | translate"
            [placeholder]="'payment.contact.placeholder_email' | translate"
            [readonly]="true"
          ></app-ux-input>
          <app-ux-textarea
            controlName="message"
            inputmode="text"
            [label]="'payment.contact.label_message' | translate"
            [placeholder]="'payment.contact.placeholder_message' | translate"
          ></app-ux-textarea>
        </div>
        <div class="ux_footer">
          <ion-button
            appTrackClick
            expand="block"
            class="button"
            name="Submit"
            size="medium"
            type="submit"
            color="uxsecondary"
            [disabled]="this.submitButtonService.isDisabled | async"
          >
            {{ 'payment.contact.submit_button' | translate }}
          </ion-button>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./contact-license.page.scss'],
})
export class ContactLicensePage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    category_code: ['', [Validators.required]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required]],
  });
  data: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiProfiles: ApiProfilesService,
    public submitButtonService: SubmitButtonService,
    private apiTicketsService: ApiTicketsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.apiProfiles.crud.get().subscribe((res) => {
      this.data = res;
      this.form.patchValue({ email: this.data?.email });
    });
  }

  handleSubmit() {
    this.form.patchValue({ category_code: 'PREMIUM_ACCOUNTS' });
    this.form.patchValue({ subject: 'Cuenta Premium' });
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
}
