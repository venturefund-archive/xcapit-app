import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { ApikeysService } from '../shared-apikeys/services/apikeys/apikeys.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterPage } from './register.page';
import { DummyComponent } from 'src/testing/dummy.component.spec';

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

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RegisterPage>;
  let apiKeysServiceSpy;
  let navControllerSpy: any;

  beforeEach(async(() => {

    apiKeysServiceSpy = jasmine.createSpyObj('ApikeysService', [
      'updateData'
    ]);


    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);

    TestBed.configureTestingModule({
      declarations: [ RegisterPage, TrackClickDirective ],
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
        { provide: ApikeysService, useValue: apiKeysServiceSpy },
        { provide: NavController, useValue: navControllerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    apiKeysServiceSpy = TestBed.inject(ApikeysService);
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateData on handleSubmit and valid form', () => {
    fixture.detectChanges();
    apiKeysServiceSpy.updateData.and.returnValue({});
    component.form.patchValue(formData.valid);
    const spy = spyOn(component, 'showAlert');
  
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call updateData on handleSubmit and invalid form', () => {
    fixture.detectChanges();
    apiKeysServiceSpy.updateData.and.returnValue({});
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
