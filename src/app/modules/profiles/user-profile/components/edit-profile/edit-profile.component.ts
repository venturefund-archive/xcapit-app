import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';
import { Validators, FormGroup, FormBuilder, Form } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { ApiProfilesService } from '../../../shared-profiles/services/api-profiles/api-profiles.service';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
            inputmode="tel"
            [errors]="this.cellphoneErrors"
          ></app-ux-input>
        </div>

        <div class="ep__bill">
          <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">{{
            'profiles.user_profile.bill_data' | translate
          }}</ion-text>

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
          <app-ux-input-google-places
            controlName="direccion"
            type="text"
            [label]="'profiles.user_profile.direccion' | translate"
          ></app-ux-input-google-places>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  condicionesIVA = [
    'IVA Responsable Inscripto',
    'IVA Responsable no Inscripto',
    'IVA Sujeto Exento',
    'Consumidor Final',
    'Responsable Monotributo',
    'Sujeto no Categorizado',
    'Proveedor del Exterior',
    'Cliente del Exterior',
    'IVA Liberado – Ley Nº 19.640',
    'IVA Responsable Inscripto – Agente de Percepción',
    'Pequeño Contribuyente Eventual',
    'Monotributista Social',
    'Pequeño Contribuyente Eventual Social'
  ];

  tiposFactura = ['A', 'B', 'C'];

  disabledButton = false;

  isFormSet = false;

  cellphoneErrors: ItemFormError[] = CONFIG.fieldErrors.cellphone;

  onlyIntegersErrors: ItemFormError[] = CONFIG.fieldErrors.onlyIntegers;

  controls = {
    first_name: ['', [Validators.required, Validators.maxLength(150)]],
    last_name: ['', [Validators.required, Validators.maxLength(150)]],
    nro_dni: [
      '',
      [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(12),
        Validators.pattern('[0-9][^.a-zA-Z]*$')
      ]
    ],
    cellphone: [
      '',
      [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(24),
        Validators.pattern('[0-9()-+][^.a-zA-Z]*$')
      ]
    ],
    condicion_iva: ['', [Validators.required]],
    tipo_factura: ['', [Validators.required]],
    cuit: [
      '',
      [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(15),
        Validators.pattern('[0-9][^.a-zA-Z]*$')
      ]
    ],
    direccion: ['', [Validators.required, Validators.maxLength(150)]]
  };

  form: FormGroup;
  @ViewChild('formElement', { static: false }) formElement: any;
  @Input()
  data: any;
  constructor(
    private apiProfiles: ApiProfilesService,
    private formBuilder: FormBuilder
  ) {}

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
    this.addRequiredValidator();
  }

  addRequiredValidator() {
    for (const key in this.controls) {
      if (Array.isArray(this.controls[key])) {
        this.controls[key][1] = [Validators.required, ...this.controls[key][1]];
      }
    }
  }
}
