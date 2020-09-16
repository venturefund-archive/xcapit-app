import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';
import { Validators, FormGroup, FormBuilder, Form } from '@angular/forms';
import { ApiProfilesService } from '../../../shared-profiles/services/api-profiles/api-profiles.service';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Countries } from '../../enums/countries.enum';
import { IvaConditions } from '../../enums/iva_conditions.enum';
import { BillType } from '../../enums/bill_types.enum';

@Component({
  selector: 'app-edit-profile',
  template: `
      <div class="ep ion-padding-start ion-padding-end ion-padding-bottom">
          <form
                  #formElement
                  [formGroup]="this.form"
                  (ngSubmit)="this.save()"
                  *ngIf="this.isFormSet"
          >
              <div class="ep__personal">
                  <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">{{
                      'profiles.user_profile.personal_data' | translate
                      }}</ion-text>
                  <!-- First name -->
                  <app-ux-input
                          controlName="first_name"
                          type="text"
                          [label]="'profiles.user_profile.first_name' | translate"
                          inputmode="text"
                  ></app-ux-input>

                  <!-- Last name -->
                  <app-ux-input
                          controlName="last_name"
                          type="text"
                          [label]="'profiles.user_profile.last_name' | translate"
                          inputmode="text"
                  ></app-ux-input>

                  <!-- DNI -->
                  <app-ux-input
                          controlName="nro_dni"
                          type="text"
                          [label]="'profiles.user_profile.nro_dni' | translate"
                          inputmode="numeric"
                          [errors]="this.onlyIntegersErrors"
                  ></app-ux-input>

                  <!-- Cellphone -->
                  <app-ux-input
                          controlName="cellphone"
                          type="text"
                          [label]="'profiles.user_profile.cellphone' | translate"
                          inputmode="numeric"
                          [errors]="this.cellphoneErrors"
                  ></app-ux-input>

                  <div class="ep__bill">
                      <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">{{
                          'profiles.user_profile.bill_data' | translate
                          }}</ion-text>

                      <!-- Pais -->
                      <app-ux-input-select
                              [label]="'profiles.user_profile.country' | translate"
                              [modalTitle]="
              'profiles.user_profile.country_placeholder' | translate
            "
                              [placeholder]="
              'profiles.user_profile.country_placeholder' | translate
            "
                              controlName="pais"
                              [data]="this.countries"
                      ></app-ux-input-select>
                  </div>

                  <!-- Condicion IVA -->
                  <app-ux-input-select
                          [label]="'profiles.user_profile.condicion_iva' | translate"
                          [modalTitle]="'profiles.user_profile.condicion_iva' | translate"
                          [placeholder]="
              'profiles.user_profile.condicion_iva_placeholder' | translate
            "
                          controlName="condicion_iva"
                          [data]="this.condicionesIVA"
                  ></app-ux-input-select>

                  <!-- Tipo factura -->
                  <app-ux-input-select
                          [label]="'profiles.user_profile.tipo_factura' | translate"
                          [modalTitle]="'profiles.user_profile.tipo_factura' | translate"
                          [placeholder]="
              'profiles.user_profile.tipo_factura_placeholder' | translate
            "
                          controlName="tipo_factura"
                          [data]="this.tiposFactura"
                  ></app-ux-input-select>

                  <!-- CUIT -->
                  <app-ux-input
                          controlName="cuit"
                          type="text"
                          [label]="'profiles.user_profile.cuit' | translate"
                          inputmode="numeric"
                          [errors]="this.onlyIntegersErrors"
                  ></app-ux-input>

                  <!-- Direccion -->
                  <app-ux-input
                          controlName="direccion"
                          type="text"
                          [label]="'profiles.user_profile.direccion' | translate"
                          inputmode="text"
                  ></app-ux-input>
              </div>
          </form>
      </div>
  `,
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  condicionesIVA = Object.values(IvaConditions);

  tiposFactura = Object.values(BillType);

  disabledButton = false;

  isFormSet = false;

  cellphoneErrors: ItemFormError[] = CONFIG.fieldErrors.cellphone;

  onlyIntegersErrors: ItemFormError[] = CONFIG.fieldErrors.onlyIntegers;

  countries = Object.values(Countries);

  controls = {
    first_name: [
      '',
      [
        Validators.required,
        Validators.maxLength(150),
        Validators.pattern('[A-Za-zÀ-ÿ \'-]*$')
      ]
    ],
    last_name: [
      '',
      [
        Validators.required,
        Validators.maxLength(150),
        Validators.pattern('[A-Za-zÀ-ÿ \'-]*$')
      ]
    ],
    nro_dni: [
      '',
      [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(12),
        Validators.pattern('[a-zA-Z0-9]*$')
      ]
    ],
    cellphone: [
      '',
      [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(24),
        Validators.pattern('[0-9]*$')
      ]
    ],
    pais: ['', [Validators.maxLength(150)]],
    condicion_iva: ['', []],
    tipo_factura: ['', []],
    cuit: [
      '',
      [
        Validators.minLength(7),
        Validators.maxLength(15),
        Validators.pattern('[0-9][^.a-zA-Z]*$')
      ]
    ],
    direccion: [
      '', 
      [
        Validators.required, 
        Validators.maxLength(150),
        Validators.pattern('[A-Za-zÀ-ÿ0-9 \'-,]*$')
      ]
    ]
  };

  form: FormGroup;
  @ViewChild('formElement') formElement: any;
  @Input()
  data: any;

  constructor(
    private apiProfiles: ApiProfilesService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.setForm();
  }

  save(): Observable<boolean> {
    if (this.form.valid) {
      this.disabledButton = true;
      return this.apiProfiles.crud.update(this.form.value).pipe(
        map(() => {
          this.disabledButton = false;
          return true;
        })
      );
    } else {
      this.form.markAllAsTouched();
    }
    return of(false);
  }

  setForm() {
    this.form = this.formBuilder.group({ ...this.controls });
    this.isFormSet = true;
    this.apiProfiles.crud.get().subscribe(res => this.form.patchValue(res));
  }

  addRequiredValidator() {
    for (const key in this.controls) {
      if (Array.isArray(this.controls[key])) {
        this.controls[key][1] = [Validators.required, ...this.controls[key][1]];
      }
    }
  }
}
