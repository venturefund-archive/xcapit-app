import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { TICKET_CATEGORIES } from 'src/app/modules/tickets/shared-tickets/constants/ticket-categories';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-ticket-form',
  template: `
    <div class="main">
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <app-ux-input
          *ngIf="this.emailInput"
          controlName="email"
          type="text"
          inputmode="text"
          [label]="'tickets.create_ticket_form.label_email' | translate"
          [placeholder]="'tickets.create_ticket_form.placeholder_email' | translate"
          [readonly]="!this.canModifyEmail"
        ></app-ux-input>
        <app-input-select
          *ngIf="!this.category"
          [label]="'tickets.create_ticket_form.label_subject' | translate"
          [modalTitle]="'tickets.create_ticket_form.placeholder_subject' | translate"
          [placeholder]="'tickets.create_ticket_form.placeholder_subject' | translate"
          controlName="subject"
          [data]="this.ticketCategories"
          key="value"
          valueKey="value"
          [translated]="true"
        ></app-input-select>
        <app-input-select
          *ngIf="this.category"
          [label]="'tickets.create_ticket_form.label_subject' | translate"
          [modalTitle]="'tickets.create_ticket_form.placeholder_subject' | translate"
          [placeholder]="'tickets.create_ticket_form.placeholder_subject' | translate"
          controlName="subject"
          [data]="this.filteredTicketCategories"
          key="value"
          valueKey="value"
          [translated]="true"
          disabled="true"
        ></app-input-select>
        <app-ux-textarea
          controlName="message"
          inputmode="text"
          [label]="'tickets.create_ticket_form.label_message' | translate"
          [placeholder]="'tickets.create_ticket_form.placeholder_message' | translate"
        ></app-ux-textarea>
        <ion-button
          appTrackClick
          class="button"
          name="Submit"
          size="medium"
          type="submit"
          color="uxsecondary"
          [disabled]="this.submitButtonService.isDisabled | async"
        >
          {{ 'tickets.create_ticket_form.submit_button' | translate }}
        </ion-button>
      </form>
      <ion-button
        *ngIf="this.isValidationEmail"
        appTrackClick
        class="button"
        name="Cancel"
        size="medium"
        type="button"
        color="uxsecondary"
        fill="clear"
      >
        {{ 'tickets.create_ticket_form.cancel_button' | translate }}
      </ion-button>
    </div>
  `,
  styleUrls: ['./create-ticket-form.component.scss'],
})
export class CreateTicketFormComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.maxLength(2000)]],
  });
  isValidationEmail = false;
  @Input() canModifyEmail = false;
  @Input() emailInput = false;
  @Input() userEmail = '';
  @Input() category: string;

  @Output()
  send = new EventEmitter<any>();

  ticketCategories = TICKET_CATEGORIES;
  filteredTicketCategories: typeof TICKET_CATEGORIES;

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.form.patchValue({ email: this.userEmail });
    if (this.category) {
      const filteredCategories = TICKET_CATEGORIES.filter((category) => category.name === this.category);
      this.filteredTicketCategories = filteredCategories;
      this.form.patchValue({ subject: filteredCategories[0] });
    }
  }
  handleSubmit() {
    if (this.form.valid) {
      const parsedValues = this.getParsedValues(this.form.value);
      this.send.emit(parsedValues);
    } else {
      this.form.markAllAsTouched();
    }
  }

  getParsedValues(formValues) {
    const valuesCopy = Object.assign({}, formValues);
    valuesCopy.category_code = valuesCopy.subject.name;
    valuesCopy.subject = this.translate.instant(valuesCopy.subject.value);
    return valuesCopy;
  }
}
