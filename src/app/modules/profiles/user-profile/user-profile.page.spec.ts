import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfilePage } from './user-profile.page';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

const formData = {
  valid: {
    first_name: 'Test',
    last_name: 'Test',
    nro_dni: '21341234',
    cellphone: '12344321',
    condicion_iva:  'Cliente del Exterior',
    tipo_factura: 'C',
    cuit: '1234123443',
    direccion: 'calle falsa 123'
  },
  invalid: {
    first_name: 'Test',
    last_name: 'Test',
    nro_dni: '213412x34',
    cellphone: '12x344321',
    condicion_iva:  'Cliente del Exterior',
    tipo_factura: 'C',
    cuit: '12341234x43',
    direccion: 'calle falsa 123'
  }
};

describe('UserProfilePage', () => {
  let component: UserProfilePage;
  let fixture: ComponentFixture<UserProfilePage>;
  let apiUsuariosServiceMock: any;
  let apiUsuariosService: ApiUsuariosService;

  beforeEach(async(() => {
    apiUsuariosServiceMock = {
      crud: {
        update: () => null
      }
    };
    TestBed.configureTestingModule({
      declarations: [UserProfilePage],
      imports: [IonicModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiUsuariosService, useValue: apiUsuariosServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiUsuariosService = TestBed.get(ApiUsuariosService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call save on submit form', () => {
    const spy = spyOn(component, 'save');
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call update on apiUsuarios.crud, valid form', () => {
    component.form.get('first_name').setValue(formData.valid.first_name);
    component.form.get('last_name').setValue(formData.valid.last_name);
    component.form.get('nro_dni').setValue(formData.valid.nro_dni);
    component.form.get('cellphone').setValue(formData.valid.cellphone);
    component.form.get('condicion_iva').setValue(formData.valid.condicion_iva);
    component.form.get('tipo_factura').setValue(formData.valid.tipo_factura);
    component.form.get('cuit').setValue(formData.valid.cuit);
    component.form.get('direccion').setValue(formData.valid.direccion);
    fixture.detectChanges();
    const spy = spyOn(apiUsuariosService.crud, 'update');
    spy.and.returnValue(of(null));
    component.save();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call update on apiUsuarios.crud, invalid form', () => {
    component.form.get('first_name').setValue(formData.valid.first_name);
    component.form.get('last_name').setValue(formData.valid.last_name);
    component.form.get('nro_dni').setValue(formData.valid.nro_dni);
    component.form.get('cellphone').setValue(formData.invalid.cellphone);
    component.form.get('condicion_iva').setValue(formData.valid.condicion_iva);
    component.form.get('tipo_factura').setValue(formData.valid.tipo_factura);
    component.form.get('cuit').setValue(formData.valid.cuit);
    component.form.get('direccion').setValue(formData.valid.direccion);
    fixture.detectChanges();
    const spy = spyOn(apiUsuariosService.crud, 'update');
    component.save();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  describe('Form values', () => {
    it('form should be valid when fields are empty', async () => {
      expect(component.form.valid).toBeTruthy();
    });

    it('form should be invalid when some fields are notvalid', async () => {
      component.form.get('cellphone').setValue(formData.invalid.cellphone);
      expect(component.form.valid).toBeFalsy();
    });
  });

});
