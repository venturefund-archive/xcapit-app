import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { StorageApikeysService } from '../shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { NewApiKeysPage } from './new-api-keys.page';

const formData = {
  valid: {
    api_key: 'sqweqweqweqweqwewqeqeqqweq',
    secret_key: 'secretsecretsecretsecretsec',
  },
  invalid: {
    api_key: '',
  },
};

describe('NewApiKeysPage', () => {
  let component: NewApiKeysPage;
  let fixture: ComponentFixture<NewApiKeysPage>;
  let storageApikeysServiceSpy;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<NewApiKeysPage>;

  beforeEach(async(() => {
    storageApikeysServiceSpy = jasmine.createSpyObj('StorageApikeysService', [
      'updateData',
    ]);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    TestBed.configureTestingModule({
      declarations: [NewApiKeysPage],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: StorageApikeysService, useValue: storageApikeysServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewApiKeysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    storageApikeysServiceSpy = TestBed.inject(StorageApikeysService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call consoleLog in submitData and valid form', () => {
    fixture.detectChanges();
    component.form.patchValue(formData.valid);
    const spy = spyOn(console, 'log');
    component.submitData();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call consoleLog in submitData and invalid form', () => {
    fixture.detectChanges();
    component.form.patchValue(formData.invalid);
    const spy = spyOn(console, 'log');
    component.submitData();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
