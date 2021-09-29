import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, NavController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { By } from '@angular/platform-browser';
import { PersonalDataPage } from './personal-data.page';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import createSpyObj = jasmine.createSpyObj;
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

const formData = {
  valid: {
    first_name: 'Test',
    cellphone: '12344321',
    direccion: 'calle falsa 123',
  },
  invalid: {
    first_name: 'Test',
    cellphone: '12x344321',
    direccion: 'calle falsa 123',
  },
};
describe('PersonalDataPage', () => {
  let component: PersonalDataPage;
  let fixture: ComponentFixture<PersonalDataPage>;
  let apiProfilesServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<PersonalDataPage>;
  let apiProfilesService: ApiProfilesService;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      apiProfilesServiceMock = {
        updatePersonalData: () => of({}),
        crud: {
          update: () => of({}),
          get: () => of({}),
        },
      };
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [PersonalDataPage, FakeTrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          ReactiveFormsModule,
          RouterTestingModule.withRoutes([
            {
              path: 'profiles/fiscal-data',
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
    fixture = TestBed.createComponent(PersonalDataPage);
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

  it('should call updatePersonalData on apiProfile when form is valid', () => {
    fixture.detectChanges();
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    const spy = spyOn(apiProfilesService, 'updatePersonalData');
    spy.and.returnValue(of(null));
    component.save();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to profile success view when successSave is called', () => {
    component.successSave();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/profiles/success'], {
      replaceUrl: true,
    });
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
    it('form should be invalid when some fields are notvalid', () => {
      fixture.detectChanges();
      component.form.get('cellphone').setValue(formData.invalid.cellphone);
      expect(component.form.valid).toBeFalsy();
    });
  });

  it('should call trackEvent on trackService when Save Personal Data button clicked', () => {
    fixture.detectChanges();
    component.form.patchValue(formData.valid);

    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Save Personal Data');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
