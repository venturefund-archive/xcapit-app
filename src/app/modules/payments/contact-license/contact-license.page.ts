import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiProfilesService } from '../../profiles/shared-profiles/services/api-profiles/api-profiles.service';

@Component({
  selector: 'app-contact-license',
  template: `
    <ion-content class="ion-padding">
      <form [formGroup]="this.form" class="ux_main">
        <div class="ux_content">
          <div class="ux_main">
            <div class="cl__title ux-font-gilory ux-fweight-extrabold ux-fsize-24">
              <ion-text>{{ 'payment.contact.title' | translate }}</ion-text>
            </div>
            <ion-text class="cl__textPrimary ux-font-lato ux-fweight-regular ux-fsize-14">
              {{ 'payment.contact.textPrimary' | translate }}
            </ion-text>
            <ion-text class="cl__label_input ux-font-lato ux-fweight-regular ux-fsize-14" color="uxsemidark">
              {{ 'payment.contact.label_email' | translate }}
            </ion-text>
            <div class="cl__email_input">
              <ion-input
                class="ux-font-lato ux-fweight-regular ux-fsize-14"
                controlName="email"
                type="text"
                [value]="this.data?.email"
                [disabled]="condition ? true : false"
              ></ion-input>
              <ion-button
                class="edit_button"
                type="button"
                name="EditButton"
                fill="clear"
                size="small"
                (click)="this.edit()"
              >
                <ion-icon class="cib__buttons__icon" style="zoom:1.1;" name="pencil-sharp"></ion-icon>
              </ion-button>
            </div>
            <ion-text class="cl__label_message ux-font-lato ux-fweight-regular ux-fsize-14" color="uxsemidark">
              {{ 'payment.contact.label_message' | translate }}
            </ion-text>
            <div class="cl__message_input">
              <app-ux-textarea class="message" controlName="message" type="text" inputmode="text"></app-ux-textarea>
            </div>
          </div>
        </div>
        <div class="cl__send_button">
          <ion-button
            appTrackClick
            name="Send"
            expand="block"
            size="large"
            type="submit"
            color="uxsecondary"
            class="ux_button"
          >
            {{ 'payment.contact.btn_send' | translate }}
          </ion-button>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./contact-license.page.scss'],
})
export class ContactLicensePage implements OnInit {
  data: any;
  condition = true;
  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required]],
    message: ['', [Validators.required]],
  });

  constructor(private formBuilder: FormBuilder, private apiProfiles: ApiProfilesService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.apiProfiles.crud.get().subscribe((res) => {
      this.data = res;
      console.log(this.data);
    });
  }

  edit() {
    if (this.condition) {
      this.condition = !this.condition;
    }
  }
}
