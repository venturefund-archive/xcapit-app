import { Component, OnInit } from '@angular/core';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-personal-data',
  template: `
      <ion-header>
          <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
              <ion-buttons slot="start">
                  <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
              </ion-buttons>
              <ion-title class="ion-text-center">{{
                  'profiles.personal_data.header' | translate
                  }}</ion-title>
          </ion-toolbar>
      </ion-header>
      <ion-content>
          <form
                  [formGroup]="this.form"
                  (ngSubmit)="this.save()"
                  *ngIf="this.isFormSet"
                  class="ion-padding ux_main"
          >
              <div class="ux_content">
                  <div class="pd__personal_data_title">
                      <app-ux-title>{{
                          'profiles.personal_data.personal_data_title' | translate
                          }}</app-ux-title>
                  </div>
                  <!-- Nombre -->
                  <app-ux-input
                          controlName="first_name"
                          type="text"
                          [label]="'profiles.personal_data.first_name' | translate"
                          inputmode="text"
                          [placeholder]="
              'profiles.personal_data.first_name_placeholder' | translate
            "
                  ></app-ux-input>

                  <!-- Telefono -->
                  <app-ux-input
                          controlName="cellphone"
                          type="text"
                          inputmode="tel"
                          [label]="'profiles.personal_data.cellphone' | translate"
                          [placeholder]="
              'profiles.personal_data.cellphone_placeholder' | translate
            "
                          [errors]="this.cellphoneErrors"
                  ></app-ux-input>
              </div>
              <div class="ux_footer">
                  <div class="pd__submit_button">
                      <ion-button
                              class="ux_button"
                              appTrackClick
                              name="Save Personal Data"
                              type="submit"
                              color="uxsecondary"
                              size="large"
                              [disabled]="this.disabledButton"
                      >
                          {{ 'profiles.personal_data.submit_button' | translate }}
                      </ion-button>
                  </div>
              </div>
          </form>
      </ion-content>
  `,
  styleUrls: ['./personal-data.page.scss']
})
export class PersonalDataPage implements OnInit {
  disabledButton = false;

  isFormSet = false;

  cellphoneErrors: ItemFormError[] = CONFIG.fieldErrors.cellphone;

  onlyIntegersErrors: ItemFormError[] = CONFIG.fieldErrors.onlyIntegers;

  controls = {
    first_name: ['', [Validators.required, Validators.maxLength(150)]],
    cellphone: [
      '',
      [
        Validators.minLength(7),
        Validators.maxLength(24),
        Validators.pattern('[0-9()-+][^.a-zA-Z]*$')
      ]
    ]
  };

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiProfiles: ApiProfilesService,
    private navController: NavController
  ) {
  }

  ngOnInit() {
    this.setForm();
  }

  save() {
    if (this.form.valid) {
      this.disabledButton = true;
      this.apiProfiles.updatePersonalData(this.form.value).subscribe(() => this.successSave());
    } else {
      this.form.markAllAsTouched();
    }
  }

  async successSave() {
    await this.navController.navigateForward(
      ['/profiles/success'],
      {
        replaceUrl: true
      });
    this.disabledButton = false;
  }

  setForm() {
    this.form = this.formBuilder.group({ ...this.controls });
    this.isFormSet = true;
    this.apiProfiles.crud.get().subscribe(res => this.form.patchValue(res));
  }
}
