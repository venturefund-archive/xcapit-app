import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterApikeysPage } from './register-apikeys.page';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';
import { of } from 'rxjs';

const formData = {
  valid: {
    api_key: 'kLnBhJuI98745Df32CsX09kN',
    secret_key: 'EvHElKo98JyDeHVfJdSwC45J657Ml4',
    alias: 'myapikey',
  },
  invalid: {
    api_key: '',
    secret_key: '',
    alias: '',
  },
};

describe('RegisterApikeysPage', () => {
  let component: RegisterApikeysPage;
  let fixture: ComponentFixture<RegisterApikeysPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RegisterApikeysPage>;
  let apiApikeysServiceSpy;
  let navControllerSpy: any;

  beforeEach(async(() => {
    apiApikeysServiceSpy = jasmine.createSpyObj('ApiApikeysService', [
      'create',
    ]);

    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);

    TestBed.configureTestingModule({
      declarations: [RegisterApikeysPage, TrackClickDirective],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'apikeys/register', component: DummyComponent },
          { path: 'apikeys/success-register', component: DummyComponent },
          { path: 'apikeys/list', component: DummyComponent },
        ]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        TrackClickDirective,
        { provide: ApiApikeysService, useValue: apiApikeysServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterApikeysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    apiApikeysServiceSpy = TestBed.inject(ApiApikeysService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call showAlert on handleSubmit and valid form', () => {
    component.form.patchValue(formData.valid);
    const spy = spyOn(component, 'showAlert');
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call showAlert on handleSubmit and invalid form', () => {
    component.form.patchValue(formData.invalid);
    const spy = spyOn(component, 'showAlert');
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call create on submitData', () => {
    apiApikeysServiceSpy.create.and.returnValue(of({}));
    component.submitData();
    expect(apiApikeysServiceSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Submit Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Submit'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Need Help Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'NeedHelp'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
