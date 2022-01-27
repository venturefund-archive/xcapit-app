import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalDataPage } from './fiscal-data.page';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, NavController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { By } from '@angular/platform-browser';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

const formData = {
  valid: {
    condicion_iva: 'Cliente del Exterior',
    tipo_factura: 'C',
    cuit: '1234123443',
    pais: 'Argentina',
  },
  invalid: {
    condicion_iva: 'Cliente del Exterior',
    tipo_factura: 'C',
    cuit: '12341234x43',
    pais: '',
  },
};

describe('FiscalDataPage', () => {
  let component: FiscalDataPage;
  let fixture: ComponentFixture<FiscalDataPage>;
  let apiProfilesServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FiscalDataPage>;
  let apiProfilesService: ApiProfilesService;
  let navControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      apiProfilesServiceMock = {
        crud: {
          update: () => of({}),
          get: () => of({}),
        },
      };
      TestBed.configureTestingModule({
        declarations: [FiscalDataPage, FakeTrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          IonicModule,
          ReactiveFormsModule,
          RouterTestingModule.withRoutes([
            {
              path: 'tabs/home',
              component: DummyComponent,
            },
            {
              path: 'profiles/success',
              component: DummyComponent,
            },
          ]),
        ],
        providers: [
          { provide: ApiProfilesService, useValue: apiProfilesServiceMock },
          { provide: NavController, useValue: navControllerSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscalDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiProfilesService = TestBed.inject(ApiProfilesService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
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
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
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
    component.form.get('cuit').setValue(formData.invalid.cuit);
    fixture.detectChanges();
    const spy = spyOn(apiProfilesService.crud, 'update');
    component.save();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  describe('Form values', () => {
    it('form should be invalid when some fields are notvalid', () => {
      fixture.detectChanges();
      component.form.get('cuit').setValue(formData.invalid.cuit);
      expect(component.form.valid).toBeFalsy();
    });
  });

  it('should call trackEvent on trackService when Save Fiscal Data button clicked', () => {
    fixture.detectChanges();
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Save Fiscal Data');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
