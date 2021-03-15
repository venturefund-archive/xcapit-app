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

const formData = {
  valid: {
    apikey: 'kLnBhJuI98745Df32CsX09kN',
    secretkey:'EvHElKo98JyDeHVfJdSwC45J657Ml4',
    alias:'myapikey'
  },
  invalid: {
    apikey: '',
    secretkey:'',
    alias:''
  }
};

describe('RegisterApikeysPage', () => {
  let component: RegisterApikeysPage;
  let fixture: ComponentFixture<RegisterApikeysPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RegisterApikeysPage>;
  let apiApikeysServiceSpy;
  let navControllerSpy: any;

  beforeEach(async(() => {

    apiApikeysServiceSpy = jasmine.createSpyObj('ApiApikeysService', [
      'updateData'
    ]);


    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);

    TestBed.configureTestingModule({
      declarations: [ RegisterApikeysPage, TrackClickDirective ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'apikeys/register', component: DummyComponent },
          { path: 'apikeys/success-register', component: DummyComponent },
          { path: 'apikeys/list', component: DummyComponent }
        ]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        IonicModule,
        ReactiveFormsModule],
      providers: [
        TrackClickDirective,
        { provide: ApiApikeysService, useValue: apiApikeysServiceSpy },
        { provide: NavController, useValue: navControllerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
    fixture.detectChanges();
    component.form.patchValue(formData.valid);
    const spy = spyOn(component, 'showAlert');
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call showAlert on handleSubmit and invalid form', () => {
    fixture.detectChanges();
    component.form.patchValue(formData.invalid);
    const spy = spyOn(component, 'showAlert');
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call trackEvent on trackService when Next Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Next'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });


});
