import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { RegisterApikeysPage } from './register-apikeys.page';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';
import { of } from 'rxjs';
import { StorageApikeysService } from '../shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { UserStatus } from '../../usuarios/shared-usuarios/enums/user-status.enum';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { RouterTestingModule } from '@angular/router/testing';

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

const QRScanResult = {
  valid: {
    error: false,
    scannedApikeys: {
      alias: 'MyAlias',
      api_key: 'kLnBhJuI98745Df32CsX09kN',
      secret_key: 'EvHElKo98JyDeHVfJdSwC45J657Ml4',
    },
  },
  noResult: {
    error: false,
    scannedApikeys: null,
  },
  formInvalid: {
    error: false,
    scannedApikeys: {
      alias: 'My Invalid Alias',
      api_key: 'kLnBhJuI98745Df32CsX09kN',
      secret_key: 'EvHElKo98JyDeHVfJdSwC45J657Ml4',
    },
  },
  invalidQR: {
    error: true,
    errorType: 'invalidQR',
  },
  cameraAccessDenied: {
    error: true,
    errorType: 'permissionDenied',
  },
  noContent: {
    error: true,
    errorType: 'noContent',
  },
};

describe('RegisterApikeysPage', () => {
  let component: RegisterApikeysPage;
  let fixture: ComponentFixture<RegisterApikeysPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RegisterApikeysPage>;
  let apiApikeysServiceSpy: any;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  let storageApiKeysServiceMock: any;
  let storageApiKeysService: StorageApikeysService;
  let apiUsuariosServiceSpy: any;

  beforeEach(
    waitForAsync(() => {
      apiApikeysServiceSpy = jasmine.createSpyObj('ApiApikeysService', ['create']);

      apiApikeysServiceSpy.create.and.returnValue(of({}));

      apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', ['status']);

      apiUsuariosServiceSpy.status.and.returnValue(of({}));

      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();

      storageApiKeysServiceMock = {
        data: undefined,
        updateData: () => Promise.resolve(),
      };

      TestBed.configureTestingModule({
        declarations: [RegisterApikeysPage, TrackClickDirective],
        imports: [
          RouterTestingModule,
          TranslateModule.forRoot(),
          HttpClientTestingModule,
          IonicModule,
          ReactiveFormsModule,
        ],
        providers: [
          TrackClickDirective,
          { provide: ApiApikeysService, useValue: apiApikeysServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          {
            provide: StorageApikeysService,
            useValue: storageApiKeysServiceMock,
          },
          { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterApikeysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    apiApikeysServiceSpy = TestBed.inject(ApiApikeysService);
    storageApiKeysService = TestBed.inject(StorageApikeysService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call submitData on handleSubmit and valid form', () => {
    component.form.patchValue(formData.valid);
    const spy = spyOn(component, 'submitData');
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call submitData on handleSubmit and invalid form', () => {
    component.form.patchValue(formData.invalid);
    const spy = spyOn(component, 'submitData');
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call create on submitData', () => {
    spyOn(component, 'getSuccessRoute').and.returnValue('');
    apiApikeysServiceSpy.create.and.returnValue(of({}));
    component.submitData();
    expect(apiApikeysServiceSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should patchFormValue on ionViewWillEnter and storage data is undefined', () => {
    storageApiKeysServiceMock.data = undefined;
    const spyForm = spyOn(component.form, 'patchValue').and.callThrough();
    component.ionViewWillEnter();
    expect(spyForm).toHaveBeenCalledTimes(0);
  });

  it('should patchFormValue on ionViewWillEnter and storage data exists', () => {
    storageApiKeysServiceMock.data = {
      id: 1,
      alias: 'test',
      nombre_bot: '',
    };
    const spyForm = spyOn(component.form, 'patchValue').and.callThrough();
    component.ionViewWillEnter();
    expect(spyForm).toHaveBeenCalledTimes(1);
  });

  it('should call status on getUserStatus', async () => {
    component.getUserStatus().then(() => {
      expect(apiUsuariosServiceSpy.status).toHaveBeenCalledTimes(1);
    });
  });

  it('should set userStatus on getUserStatus', async () => {
    apiUsuariosServiceSpy.status.and.returnValue(of({ status_name: UserStatus.BEGINNER }));
    component.getUserStatus().then(() => {
      expect(component.userStatus).toEqual({ status_name: UserStatus.BEGINNER });
    });
  });

  [
    {
      userStatus: { status_name: UserStatus.BEGINNER },
      expectedRoute: '/apikeys/success-register-beginner',
      isBeginner: true,
      isExplorer: false,
      isCreator: false,
      isFirstFund: true,
    },
    {
      userStatus: { status_name: UserStatus.EXPLORER },
      expectedRoute: '/apikeys/success-register-beginner',
      isBeginner: false,
      isExplorer: true,
      isCreator: false,
      isFirstFund: true,
    },
    {
      userStatus: { status_name: UserStatus.CREATOR },
      expectedRoute: '/apikeys/success-register-beginner',
      isBeginner: false,
      isExplorer: false,
      isCreator: true,
      isFirstFund: true,
    },
    {
      userStatus: { status_name: UserStatus.COMPLETE },
      expectedRoute: '/apikeys/success-register',
      isBeginner: false,
      isExplorer: false,
      isCreator: false,
      isFirstFund: false,
    },
  ].forEach((p) => {
    describe(`when userStatus is ${p.userStatus.status_name}`, () => {
      beforeEach(() => {
        component.userStatus = p.userStatus;
      });

      it(`should return ${p.isBeginner} on isBeginnerUser`, () => {
        const isBeginnerUser = component.isBeginnerUser();
        expect(isBeginnerUser).toEqual(p.isBeginner);
      });

      it(`should return ${p.isExplorer} on isExplorerUser`, () => {
        const isExplorerUser = component.isExplorerUser();
        expect(isExplorerUser).toEqual(p.isExplorer);
      });

      it(`should return ${p.isCreator} on isCreatorUser`, () => {
        const isCreatorUser = component.isCreatorUser();
        expect(isCreatorUser).toEqual(p.isCreator);
      });

      it(`should return ${p.isFirstFund} on isFirstFund`, () => {
        const isFirstFund = component.isFirstFund();
        expect(isFirstFund).toEqual(p.isFirstFund);
      });

      it(`should redirect user to ${p.expectedRoute} on submitData`, async () => {
        navControllerSpy.navigateForward.and.returnValue(Promise.resolve());
        component.submitData();
        fixture
          .whenStable()
          .then(() => expect(navControllerSpy.navigateForward).toHaveBeenCalledWith([p.expectedRoute]));
      });
    });
  });

  it('should call trackEvent on trackService when Submit Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Submit');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Use QR Button clicked', () => {
    spyOn(component, 'readQRCode');
    component.inPWA = false;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Use QR');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to Apikeys Scan with tutorial step when Use QR Button is clicked and is tutorial step', () => {
    component.inPWA = false;
    component.isTutorialStep = true;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Use QR"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/apikeys/scan', true]);
  });

  it('should navigate to Apikeys Scan without tutorial step when Use QR Button is clicked and is not tutorial step', () => {
    component.inPWA = false;
    component.isTutorialStep = false;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Use QR"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/apikeys/scan', false]);
  });
});
