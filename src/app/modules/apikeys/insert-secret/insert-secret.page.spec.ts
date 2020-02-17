import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertSecretPage } from './insert-secret.page';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { InsertKeyPage } from '../insert-key/insert-key.page';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageApikeysService } from '../shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';

const formData = {
  valid: {
    secret_key: 'some_large_test_secret_key'
  },
  invalid: {
    secret_key: ''
  }
};

const apikeyStorageData = {
  valid: {
    data: {
      api_key: 'some_large_test_api_key',
      exchange: 'binance'
    },
    valid: true
  },
  invalid: {
    data: {
      api_key: '',
      exchange: ''
    },
    valid: false
  }
};

describe('InsertSecretPage', () => {
  let component: InsertSecretPage;
  let fixture: ComponentFixture<InsertSecretPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InsertSecretPage>;
  // let storageApikeysServiceSpy;
  let storageApikeysServiceMock;
  let storageApikeysService;
  let apiApikeysServiceMock: any;

  beforeEach(async(() => {
    apiApikeysServiceMock = {
      crud: jasmine.createSpyObj('CRUD', ['create'])
    };
    storageApikeysServiceMock = {
      data: of(apikeyStorageData.valid.data),
      valid: apikeyStorageData.valid.valid,
      clear: () => of({})
    }
    TestBed.configureTestingModule({
      declarations: [InsertSecretPage, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'apikeys/tutorial', component: DummyComponent },
          { path: 'apikeys/insert-key', component: DummyComponent }
        ]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        IonicModule,
        ReactiveFormsModule
      ],
      providers: [
        TrackClickDirective,
        {
          provide: ApiApikeysService,
          useValue: apiApikeysServiceMock
        },
        { provide: StorageApikeysService, useValue: storageApikeysServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertSecretPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    storageApikeysService = TestBed.get(StorageApikeysService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call crud on handleSubmit and valid form', () => {
    fixture.detectChanges();
    apiApikeysServiceMock.crud.create.and.returnValue(of({}));
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    expect(apiApikeysServiceMock.crud.create).toHaveBeenCalledTimes(1);
  });

  it('should not call crud on handleSubmit and valid form', () => {
    fixture.detectChanges();
    apiApikeysServiceMock.crud.create.and.returnValue(of({}));
    component.form.patchValue(formData.invalid);
    component.handleSubmit();
    expect(apiApikeysServiceMock.crud.create).toHaveBeenCalledTimes(0);
  });


  it('should call trackEvent on trackService when Save API Keys Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Save API Keys'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
