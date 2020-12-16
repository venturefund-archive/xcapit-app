import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditApiKeyPage } from './edit-apikeys.page';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';

const formData = {
  valid: {
    api_key: 'some_large_test_key',
    secret_key: 'some_large_test_secret_key',
  },
  invalid: {
    api_key: '',
    secret_key: '',
  },
};

describe('EditApiKeyPage', () => {
  let component: EditApiKeyPage;
  let fixture: ComponentFixture<EditApiKeyPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<EditApiKeyPage>;
  let apiApikeysServiceMock: any;
  let navControllerSpy: any;

  beforeEach(async(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    navControllerSpy.navigateForward.and.returnValue(Promise.resolve());
    apiApikeysServiceMock = {
      crud: jasmine.createSpyObj('CRUD', ['update']),
    };

    TestBed.configureTestingModule({
      declarations: [EditApiKeyPage, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'funds/fund-settings', component: DummyComponent },
          { path: 'apikeys/success', component: DummyComponent },
        ]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        TrackClickDirective,
        {
          provide: ApiApikeysService,
          useValue: apiApikeysServiceMock,
        },
        { provide: NavController, useValue: navControllerSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditApiKeyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call crud on handleSubmit and valid form', () => {
    fixture.detectChanges();
    apiApikeysServiceMock.crud.update.and.returnValue(of({}));
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    expect(apiApikeysServiceMock.crud.update).toHaveBeenCalledTimes(1);
  });

  it('should not call crud on handleSubmit and valid form', () => {
    fixture.detectChanges();
    apiApikeysServiceMock.crud.update.and.returnValue(of({}));
    component.form.patchValue(formData.invalid);
    component.handleSubmit();
    expect(apiApikeysServiceMock.crud.update).toHaveBeenCalledTimes(0);
  });

  it('should call trackEvent on trackService when Save API Keys Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Edit ApiKey'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

    it('should call window.open when openTutorialApiKey is called', () => {
    spyOn(window, 'open');
    component.openTutorialApiKey();
    expect(window.open).toHaveBeenCalledTimes(1);
  });
});
