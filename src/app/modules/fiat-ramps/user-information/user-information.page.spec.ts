import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { UserInformationPage } from './user-information.page';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { of } from 'rxjs';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

const formData = {
  valid: {
    nombre: 'prueba',
    apellido: 'prueba',
    nacionalidad: 'Argentina',
    nacimiento: '01/01/1980',
    genero: { name: 'male', value: 'fiat_ramps.register.gender_list.male' },
    estado_civil: { name: 'married', value: 'fiat_ramps.register.marital_status_list.married' },
    tipo_doc: { name: 'DU', value: 'fiat_ramps.register.doctypes_list.DU' },
    nro_doc: '33333333',
    ciudad: 'Test city',
    codigo_postal: '666',
    direccion_calle: 'San Martín',
    direccion_nro: '777',
    expuesto_politicamente: false,
  },
  invalid: {
    nombre: '',
    apellido: '',
    nacionalidad: '',
    nacimiento: '',
    genero: '',
    estado_civil: '',
    tipo_doc: '',
    nro_doc: '',
    ciudad: '',
    codigo_postal: '',
    direccion_calle: '',
    direccion_nro: '',
    expuesto_politicamente: false,
  },
  patched: {
    nombre: 'prueba',
    apellido: 'prueba',
    nacionalidad: 'Argentina',
    nacimiento: '01/01/1980',
    genero: 'male',
    estado_civil: 'married',
    tipo_doc: 'DU',
    nro_doc: '33333333',
    ciudad: 'Test city',
    codigo_postal: '666',
    direccion_calle: 'San Martín',
    direccion_nro: '777',
    expuesto_politicamente: false,
  },
};

describe('UserInformationPage', () => {
  let component: UserInformationPage;
  let fixture: ComponentFixture<UserInformationPage>;
  let fiatRampsServiceSpy: any;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UserInformationPage>;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        registerUserInfo: of({}),
      });

      TestBed.configureTestingModule({
        declarations: [UserInformationPage, TrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [HttpClientTestingModule, IonicModule, TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          TrackClickDirective,
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInformationPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call registerUserInfo when form submited is valid', () => {
    fiatRampsServiceSpy.registerUserInfo.and.returnValue(of({}));
    component.form.patchValue(formData.valid);
    fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
    expect(fiatRampsServiceSpy.registerUserInfo).toHaveBeenCalledTimes(1);
  });

  it('should not call registerUserInfo when form submited is invalid', () => {
    fiatRampsServiceSpy.registerUserInfo.and.returnValue(of({}));
    component.form.patchValue(formData.invalid);
    fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
    expect(fiatRampsServiceSpy.registerUserInfo).toHaveBeenCalledTimes(0);
  });

  it('should patch form items into data when form is submited', () => {
    fiatRampsServiceSpy.registerUserInfo.and.returnValue(of({}));
    component.form.patchValue(formData.valid);
    fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
    expect(fiatRampsServiceSpy.registerUserInfo).toHaveBeenCalledOnceWith(formData.patched);
  });

  it('should call trackEvent on trackService when Next Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Next');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
