import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { TicketCategories } from 'src/app/modules/tickets/shared-tickets/enums/ticket-categories.enum';
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
        <app-ux-input-select-traduction
          *ngIf="!this.category"
          controlName="subject"
          type="text"
          [label]="'tickets.create_ticket_form.label_subject' | translate"
          [placeholder]="'tickets.create_ticket_form.placeholder_subject' | translate"
          [modalTitle]="'tickets.create_ticket_form.placeholder_subject' | translate"
          [data]="this.data"
        ></app-ux-input-select-traduction>
        <app-ux-input
          *ngIf="this.category"
          controlName="subject"
          type="text"
          inputmode="text"
          [label]="'tickets.create_ticket_form.label_subject' | translate"
          [placeholder]="'tickets.create_ticket_form.placeholder_subject' | translate"
          [readonly]="this.category"
        ></app-ux-input>
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
    category_code: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.maxLength(2000)]],
  });
  isValidationEmail = false;
  @Input() canModifyEmail = false;
  @Input() emailInput = false;
  @Input() userEmail = '';
  @Input() category: string;

  @Output()
  send = new EventEmitter<any>();

  data = Object.values(TicketCategories).map((key) => this.translateCategoryCode(key));

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.form.patchValue({ email: this.userEmail });

    if (this.category) {
      const subjectValue = this.data.find((value) => value === this.category);
      this.form.patchValue({ subject: subjectValue });
    }
  }
  handleSubmit() {
    this.setCategoryCode();
    if (this.form.valid) {
      this.send.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  setCategoryCode() {
    const subject = this.form.value.subject;
    const categoryCode = Object.keys(TicketCategories).find(
      (catItem) => this.translateCategoryCode(TicketCategories[catItem]) === subject
    );
    this.form.patchValue({ category_code: categoryCode });
  }

  translateCategoryCode(value) {
    return this.translate.instant(`tickets.categories.${value}`);
  }
}
