import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfilePage } from './user-profile.page';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApiRunsService } from '../../runs/shared-runs/services/api-runs/api-runs.service';

const formData = {
  valid: {
    first_name: 'Test',
    last_name: 'Test',
    nro_dni: '21341234',
    cellphone: '12344321',
    condicion_iva: 'Cliente del Exterior',
    tipo_factura: 'C',
    cuit: '1234123443',
    direccion: 'calle falsa 123'
  },
  invalid: {
    first_name: 'Test',
    last_name: 'Test',
    nro_dni: '213412x34',
    cellphone: '12x344321',
    condicion_iva: 'Cliente del Exterior',
    tipo_factura: 'C',
    cuit: '12341234x43',
    direccion: 'calle falsa 123'
  }
};

describe('UserProfilePage', () => {
  let component: UserProfilePage;
  let fixture: ComponentFixture<UserProfilePage>;
  let apiProfilesServiceMock: any;
  let apiProfilesService: ApiProfilesService;
  let apiRunsServiceSpy: any;

  beforeEach(async(() => {
    apiRunsServiceSpy = jasmine.createSpyObj('ApiRunsService', ['hasActive']);
    apiRunsServiceSpy.hasActive.and.returnValue(of(false));
    apiProfilesServiceMock = {
      crud: {
        update: () => of({}),
        get: () => of({})
      }
    };

    TestBed.configureTestingModule({
      declarations: [UserProfilePage],
      imports: [
        TranslateModule.forRoot(),
        IonicModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiProfilesService, useValue: apiProfilesServiceMock },
        { provide: ApiRunsService, useValue: apiRunsServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfilePage);
    component = fixture.componentInstance;
    apiProfilesService = TestBed.get(ApiProfilesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call get on apiProfile.crud when ngOnInit', () => {
    const spy = spyOn(apiProfilesService.crud, 'get');
    spy.and.returnValue(of({}));
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call save on submit form', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'save');
    fixture.debugElement
      .query(By.css('form'))
      .triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call update on apiProfile.crud, valid form', () => {
    fixture.detectChanges();
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    const spy = spyOn(apiProfilesService.crud, 'update');
    spy.and.returnValue(of(null));
    component.save();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call update on apiProfile.crud, invalid form', () => {
    fixture.detectChanges();
    component.form.patchValue(formData.valid);
    component.form.get('cellphone').setValue(formData.invalid.cellphone);
    fixture.detectChanges();
    const spy = spyOn(apiProfilesService.crud, 'update');
    component.save();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  describe('Form values', () => {

    it('form should be invalid when fields are empty and active runs is true', () => {
      apiRunsServiceSpy.hasActive.and.returnValue(of(true));
      fixture.detectChanges();
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be valid when fields are empty and active runs is false', () => {
      fixture.detectChanges();
      expect(component.form.valid).toBeTruthy();
    });

    it('form should be invalid when some fields are notvalid', () => {
      fixture.detectChanges();
      component.form.get('cellphone').setValue(formData.invalid.cellphone);
      expect(component.form.valid).toBeFalsy();
    });
  });
});
