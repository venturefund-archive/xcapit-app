import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { UserInformationPage } from './user-information.page';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';

const formData = {
  valid: {
    nombre: 'prueba',
    apellido: 'prueba',
    nacionalidad: 'Argentina',
    nacimiento: '01/01/1980',
    genero: 'Masculino',
    estado_civil: 'single',
    tipo_doc: 'DNI',
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
};

describe('RegisterPagePage', () => {
  let component: UserInformationPage;
  let fixture: ComponentFixture<UserInformationPage>;
  let fiatRampsServiceSpy: any;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UserInformationPage>;

  beforeEach(async(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      registerUserInfo: of({}),
    });

    TestBed.configureTestingModule({
      declarations: [UserInformationPage, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'fiat-ramps/user-bank', component: DummyComponent },
          { path: 'fiat-ramps/operations-new', component: DummyComponent },
        ]),
        HttpClientTestingModule,
        IonicModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        TrackClickDirective,
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInformationPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call registerUserInfo on handleSubmit and valid form', async (done) => {
    fiatRampsServiceSpy.registerUserInfo.and.returnValue(of({}));
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fiatRampsServiceSpy.registerUserInfo).toHaveBeenCalledTimes(1);
    });
    done();
  });
});
