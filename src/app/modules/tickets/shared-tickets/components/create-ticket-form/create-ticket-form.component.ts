import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { TICKET_CATEGORIES } from 'src/app/modules/tickets/shared-tickets/constants/ticket-categories';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiTicketsService } from '../../services/api-tickets.service';

@Component({
  selector: 'app-create-ticket-form',
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
      <div class="main">
        <form [formGroup]="this.form" class="ux_main">
          <app-input-select
            *ngIf="!this.category"
            [label]="'tickets.create_ticket_form.label_subject' | translate"
            [modalTitle]="'tickets.create_ticket_form.placeholder_subject' | translate"
            [placeholder]="'tickets.create_ticket_form.placeholder_subject' | translate"
            controlName="subject"
            [data]="this.ticketCategories"
            selectorStyle="white"
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
            selectorStyle="white"
            key="value"
            valueKey="value"
            [translated]="true"
            disabled="true"
          ></app-input-select>
          <app-ux-input
            *ngIf="this.emailInput"
            controlName="email"
            type="text"
            inputmode="text"
            [label]="'tickets.create_ticket_form.label_email' | translate"
            [placeholder]="'tickets.create_ticket_form.placeholder_email' | translate"
            [readonly]="!this.canModifyEmail"
          ></app-ux-input>
          <app-ux-textarea
            controlName="message"
            inputmode="text"
            [label]="'tickets.create_ticket_form.label_message' | translate"
            [placeholder]="'tickets.create_ticket_form.placeholder_message' | translate"
          ></app-ux-textarea>
          <div class="required-fields">
            <ion-text class="ux-font-text-xs">{{ 'tickets.create_ticket_form.required' | translate }}</ion-text>
          </div>
          <div class="disclaimer">
            <div class="icon">
              <ion-icon name="ux-tray"></ion-icon>
            </div>
            <div class="text">
              <ion-text class="ux-font-text-xs">{{
                'tickets.create_ticket_form.disclaimer_text' | translate
              }}</ion-text>
              <ion-button class="ux-link-xs" fill="clear" size="small" color="info">{{
                'tickets.create_ticket_form.disclaimer_link' | translate
              }}</ion-button>
            </div>
          </div>
        </form>
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
  styleUrls: ['./create-ticket-form.component.scss'],
})
export class CreateTicketFormComponent implements OnInit {
  isValidationEmail = false;
  form: UntypedFormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.maxLength(2000)]],
  });;
  @Input() canModifyEmail = false;
  @Input() emailInput = false;
  @Input() userEmail = '';
  @Input() category: string;

  @Output()
  success = new EventEmitter<any>();
  error = new EventEmitter<any>();

  ticketCategories = TICKET_CATEGORIES;
  filteredTicketCategories: typeof TICKET_CATEGORIES;

  constructor(
    private translate: TranslateService,
    private apiTicketsService: ApiTicketsService,
    private formBuilder: FormBuilder,
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
    console.log('Entra a handlesubmit')
    const parsedValues = this.getParsedValues(this.form.value);
    this.apiTicketsService.crud.create(parsedValues).subscribe(
      (data) => this.success.emit(data),
      (error) => this.error.emit(error),
    );
  }

  getParsedValues(formValues) {
    const valuesCopy = Object.assign({}, formValues);
    valuesCopy.category_code = valuesCopy.subject.name;
    valuesCopy.subject = this.translate.instant(valuesCopy.subject.value);
    return valuesCopy;
  }
}
