import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TICKET_CATEGORIES } from 'src/app/modules/tickets/shared-tickets/constants/ticket-categories';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiTicketsService } from '../../services/api-tickets.service';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { CapacitorDeviceInjectable } from 'src/app/shared/models/capacitor-device/injectable/capacitor-device.injectable';
import { AppVersionInjectable } from 'src/app/shared/models/app-version/injectable/app-version.injectable';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';

@Component({
  selector: 'app-create-ticket-form',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button (click)="this.goBack()" defaultHref=""></ion-back-button>
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
              <ion-button
                class="ux-link-xs"
                fill="clear"
                size="small"
                color="info"
                name="Privacy Policies"
                (click)="this.goToPrivacyPolicies()"
                >{{ 'tickets.create_ticket_form.disclaimer_link' | translate }}</ion-button
              >
            </div>
          </div>
        </form>
      </div>
    </ion-content>

    <ion-footer slot="fixed" class="footer">
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
  links = LINKS;
  isValidationEmail = false;
  form: UntypedFormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.maxLength(2000)]],
  });
  @Input() canModifyEmail = false;
  @Input() emailInput = false;
  @Input() userEmail = '';
  @Input() category: string;

  @Output()
  successTicketCreation = new EventEmitter<any>();
  @Output()
  errorTicketCreation = new EventEmitter<any>();
  @Output()
  ionBackButton = new EventEmitter<void>();

  ticketCategories = TICKET_CATEGORIES;
  filteredTicketCategories: typeof TICKET_CATEGORIES;

  constructor(
    private translate: TranslateService,
    private apiTicketsService: ApiTicketsService,
    private formBuilder: FormBuilder,
    private browserService: BrowserService,
    private capacitorDeviceInjectable: CapacitorDeviceInjectable,
    private appVersionInjectable: AppVersionInjectable,
    private platformService: PlatformService
  ) {}

  ngOnInit() {
    this.notShowWarrantyCategorie()
    this.form.patchValue({ email: this.userEmail });
    if (this.category) {
      const filteredCategories = TICKET_CATEGORIES.filter((category) => category.name === this.category);
      this.filteredTicketCategories = filteredCategories;
      this.form.patchValue({ subject: filteredCategories[0] });
    }
  }

  notShowWarrantyCategorie(){
    this.ticketCategories = TICKET_CATEGORIES.filter((category) => category.name !== 'Garantía')
  }
  async handleSubmit() {
    const parsedValues = await this.getParsedValues(this.form.value);

    this.apiTicketsService.createTicket(parsedValues).subscribe(
      (data) => this.successTicketCreation.emit(this.form.value),
      (error) => this.errorTicketCreation.emit(error)
    );
  }

  async getParsedValues(formValues) {
    const valuesCopy = Object.assign({}, formValues);
    valuesCopy.category_code = valuesCopy.subject.name;
    valuesCopy.subject = this.translate.instant(valuesCopy.subject.value);
    valuesCopy.device_info = await this.getParsedDeviceInfo();
    return valuesCopy;
  }

  async getParsedAppInfo() {
    const appVersion = this.platformService.isNative() ? await this.appVersionInjectable.create().current() : 'PWA';
    return `versionApp: ${appVersion}`;
  }

  async getParsedDeviceInfo() {
    const deviceInfo = await this.capacitorDeviceInjectable.create().infoDevice();
    return `platform:${deviceInfo.platform}, os_version:${deviceInfo.osVersion}, operatingSystem:${
      deviceInfo.operatingSystem
    }, manufacturer:${deviceInfo.manufacturer}, model:${deviceInfo.model}, webViewVersion:${
      deviceInfo.webViewVersion
    }, ${await this.getParsedAppInfo()}`;
  }
  goToPrivacyPolicies() {
    this.browserService.open({ url: this.links.xcapitPrivacyPolicy });
  }

  goBack() {
    this.ionBackButton.emit();
  }
}
