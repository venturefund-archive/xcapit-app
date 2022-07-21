import { Component, OnInit } from '@angular/core';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Countries } from '../user-profile/enums/countries.enum';
import { IvaConditions } from '../user-profile/enums/iva_conditions.enum';
import { BillType } from '../user-profile/enums/bill_types.enum';

@Component({
  selector: 'app-fiscal-data',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profiles/personal-data"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'profiles.fiscal_data.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form [formGroup]="this.form" (ngSubmit)="this.save()" *ngIf="this.isFormSet" class="ion-padding ux_main">
        <div class="ux_content">
          <div class="fd__fiscal_data_title">
            <app-ux-title>{{ 'profiles.fiscal_data.fiscal_data_title' | translate }}</app-ux-title>
          </div>
          <div class="fd__fiscal_data_not_sure_text">
            <app-ux-text>{{ 'profiles.fiscal_data.not_sure_text' | translate }}</app-ux-text>
          </div>

          <!-- Pais -->
          <app-ux-input-select
            [label]="'profiles.fiscal_data.country' | translate"
            [modalTitle]="'profiles.fiscal_data.country_placeholder' | translate"
            [placeholder]="'profiles.fiscal_data.country_placeholder' | translate"
            controlName="pais"
            [data]="this.countries"
          ></app-ux-input-select>

          <!-- CUIT -->
          <app-ux-input
            controlName="cuit"
            type="text"
            inputmode="numeric"
            [label]="'profiles.fiscal_data.cuit' | translate"
            [placeholder]="'profiles.fiscal_data.cuit_placeholder' | translate"
            [errors]="this.onlyIntegersErrors"
          ></app-ux-input>

          <!-- Condicion IVA -->
          <app-ux-radio-group [label]="'profiles.fiscal_data.iva_condition' | translate">
            <ion-list>
              <ion-radio-group formControlName="condicion_iva">
                <div class="container" *ngFor="let ci of condicionesIva; let last = last">
                  <ion-item>
                    <ion-label>{{ ci }}</ion-label>
                    <ion-radio mode="md" slot="start" [value]="ci" checked></ion-radio>
                  </ion-item>
                  <div class="list-divider" *ngIf="!last"></div>
                </div>
              </ion-radio-group>
            </ion-list>
            <app-errors-form-item controlName="condicion_iva"></app-errors-form-item>
          </app-ux-radio-group>

          <!-- Tipo factura -->
          <app-ux-radio-group [label]="'profiles.fiscal_data.tipo_factura' | translate">
            <ion-list>
              <ion-radio-group formControlName="tipo_factura">
                <div class="container" *ngFor="let tf of tiposFactura; let last = last">
                  <ion-item>
                    <ion-label>{{ tf }}</ion-label>
                    <ion-radio mode="md" slot="start" [value]="tf"></ion-radio>
                  </ion-item>

                  <div class="list-divider" *ngIf="!last"></div>
                </div>
              </ion-radio-group>
            </ion-list>
            <app-errors-form-item controlName="tipo_factura"></app-errors-form-item>
          </app-ux-radio-group>
        </div>
        <div class="ux_footer">
          <div class="fd__submit_button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Save Fiscal Data"
              type="submit"
              color="secondary"
              size="large"
              [disabled]="this.disabledButton"
            >
              {{ 'profiles.fiscal_data.submit_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./fiscal-data.page.scss'],
})
export class FiscalDataPage implements OnInit {
  disabledButton = false;

  isFormSet = false;

  onlyIntegersErrors: ItemFormError[] = CONFIG.fieldErrors.onlyIntegers;
  controls = {
    condicion_iva: ['', [Validators.required]],
    tipo_factura: ['', [Validators.required]],
    cuit: [
      '',
      [Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern('[0-9][^.a-zA-Z]*$')],
    ],
    pais: ['', [Validators.required, Validators.maxLength(150)]],
  };

  form: FormGroup;

  condicionesIva = Object.values(IvaConditions);

  tiposFactura = Object.values(BillType);

  countries = Object.values(Countries);

  interfaceOptions = {
    header: this.translate.instant('profiles.fiscal_data.country'),
  };

  constructor(
    private formBuilder: FormBuilder,
    private apiProfiles: ApiProfilesService,
    private navController: NavController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.setForm();
  }

  save() {
    if (this.form.valid) {
      this.disabledButton = true;
      this.apiProfiles.crud.update(this.form.value).subscribe(() => {
        this.navController.navigateForward(['/profiles/success'], {
          replaceUrl: true,
        });
        this.disabledButton = false;
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  setForm() {
    this.form = this.formBuilder.group({ ...this.controls });
    this.isFormSet = true;
    this.apiProfiles.crud.get().subscribe((res) => this.form.patchValue(res));
  }
}