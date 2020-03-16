import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { By } from '@angular/platform-browser';
import { PersonalDataPage } from './personal-data.page';
import { DummyComponent } from 'src/testing/dummy.component.spec';
const formData = {
  valid: {
    first_name: 'Test',
    last_name: 'Test',
    nro_dni: '21341234',
    cellphone: '12344321',
    direccion: 'calle falsa 123'
  },
  invalid: {
    first_name: 'Test',
    last_name: 'Test',
    nro_dni: '213412x34',
    cellphone: '12x344321',
    direccion: 'calle falsa 123'
  }
};
describe('PersonalDataPage', () => {
  let component: PersonalDataPage;
  let fixture: ComponentFixture<PersonalDataPage>;
  let apiProfilesServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<PersonalDataPage>;
  let apiProfilesService: ApiProfilesService;

  beforeEach(async(() => {
    apiProfilesServiceMock = {
      crud: {
        update: () => of({}),
        get: () => of({})
      }
    };
    TestBed.configureTestingModule({
      declarations: [PersonalDataPage, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'profiles/fiscal-data',
            component: DummyComponent
          }
        ])
      ],
      providers: [
        TrackClickDirective,
        { provide: ApiProfilesService, useValue: apiProfilesServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiProfilesService = TestBed.get(ApiProfilesService);
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
    component.form.get('nro_dni').setValue(formData.invalid.nro_dni);
    fixture.detectChanges();
    const spy = spyOn(apiProfilesService.crud, 'update');
    component.save();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  describe('Form values', () => {
    it('form should be invalid when some fields are notvalid', () => {
      fixture.detectChanges();
      component.form.get('nro_dni').setValue(formData.invalid.nro_dni);
      expect(component.form.valid).toBeFalsy();
    });
  });

  it('should call trackEvent on trackService when Save Personal Data button clicked', () => {
    fixture.detectChanges();
    component.form.patchValue(formData.valid);

    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Save Personal Data'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
