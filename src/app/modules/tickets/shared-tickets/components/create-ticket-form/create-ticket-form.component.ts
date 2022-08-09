import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { TICKET_CATEGORIES } from 'src/app/modules/tickets/shared-tickets/constants/ticket-categories';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-ticket-form',
  template: `
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
            <ion-text class="ux-font-text-xs">{{ 'tickets.create_ticket_form.disclaimer_text' | translate }}</ion-text>
            <ion-button class="ux-link-xs" fill="clear" size="small" color="info">{{ 'tickets.create_ticket_form.disclaimer_link' | translate }}</ion-button>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./create-ticket-form.component.scss'],
})
export class CreateTicketFormComponent implements OnInit {
  isValidationEmail = false;
  @Input() form: UntypedFormGroup;
  @Input() canModifyEmail = false;
  @Input() emailInput = false;
  @Input() userEmail = '';
  @Input() category: string;

  @Output()
  send = new EventEmitter<any>();

  ticketCategories = TICKET_CATEGORIES;
  filteredTicketCategories: typeof TICKET_CATEGORIES;

  constructor() {}

  ngOnInit() {
    this.form.patchValue({ email: this.userEmail });
    if (this.category) {
      const filteredCategories = TICKET_CATEGORIES.filter((category) => category.name === this.category);
      this.filteredTicketCategories = filteredCategories;
      this.form.patchValue({ subject: filteredCategories[0] });
    }
  }
}
