import { ComponentFixture, fakeAsync, TestBed, waitForAsync, tick } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { SecurityConfigurationPage } from './security-configuration.page';
import { BiometricAuthInjectable } from 'src/app/shared/models/biometric-auth/injectable/biometric-auth.injectable';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { LoginBiometricActivationModalService } from '../../users/shared-users/services/login-biometric-activation-modal-service/login-biometric-activation-modal.service';
import { FakeBiometricAuth } from 'src/app/shared/models/biometric-auth/fake/fake-biometric-auth';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { of } from 'rxjs';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { AppExpirationTimeService } from 'src/app/shared/models/app-session/injectable/app-expiration-time.service';
import { LoginToken } from '../../users/shared-users/models/login-token/login-token';

describe('SecurityConfigurationPage', () => {
  let component: SecurityConfigurationPage;
  let fixture: ComponentFixture<SecurityConfigurationPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let biometricAuthInjectableSpy: jasmine.SpyObj<BiometricAuthInjectable>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let loginBiometricActivationModalSpy: jasmine.SpyObj<LoginBiometricActivationModalService>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let passwordSpy: jasmine.Spy;
  let appExpirationTimeServiceSpy: jasmine.SpyObj<AppExpirationTimeService>;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController(null, { data: 'fake_password' });
    modalControllerSpy = fakeModalController.createSpy();
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    toastServiceSpy = jasmine.createSpyObj('ToastService', { showErrorToast: Promise.resolve() });

    biometricAuthInjectableSpy = jasmine.createSpyObj('BiometricAuthInjectable', {
      create: new FakeBiometricAuth(),
    });
    loginBiometricActivationModalSpy = jasmine.createSpyObj('LoginBiometricActivationModalService', {
      enableModal: Promise.resolve(),
    });
    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getFeatureFlag: true,
    });
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(2),
    });
    appExpirationTimeServiceSpy = jasmine.createSpyObj('AppExpirationTimeService', {
      set: Promise.resolve(),
      get: Promise.resolve(2),
    });


    TestBed.configureTestingModule({
      declarations: [SecurityConfigurationPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: BiometricAuthInjectable, useValue: biometricAuthInjectableSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: LoginBiometricActivationModalService, useValue: loginBiometricActivationModalSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: AppExpirationTimeService, useValue: appExpirationTimeServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityConfigurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.biometricValueChangesSubscription$ = of({}).subscribe();
    component.inactivityValueChangesSubscription$ = of({}).subscribe();
    passwordSpy = spyOn(LoginToken.prototype, 'valid').and.resolveTo(true);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly texts and toggle when bioauth is available', async () => {
    component.isBioAuthEnabled = true;
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();
    const [label1, label2] = fixture.debugElement.queryAll(By.css('.sco__toggle__labels ion-text'));
    const toggle = fixture.debugElement.query(By.css('ion-toggle[name="ux_create_all"]'));
    expect(label1.nativeElement.innerHTML).toContain('profiles.biometric_auth.toggle_text');
    expect(label2.nativeElement.innerHTML).toContain('profiles.biometric_auth.toggle_description');
    expect(toggle).toBeTruthy();
  });

  it('should set toggle and session expiration time on enter', async () => {
    await component.ionViewDidEnter();
    expect(component.form.value.biometric).toBeTrue();
    expect(component.form.value.inactivity).toEqual('2');
  });

  it('should show password modal on enable toggle', fakeAsync(() => {
    component.ionViewDidEnter();
    tick();
    component.form.patchValue({ biometric: true });
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  }));

  it('should show toast on wrong password', async () => {
    biometricAuthInjectableSpy.create.and.returnValue(
      new FakeBiometricAuth(null, Promise.resolve(false), null, Promise.reject({ messsage: 'wrong pass' }))
    );
    fakeModalController.modifyReturns(null, { data: 'aWrongPassword' });
    await component.ionViewDidEnter();
    await component.toggle(true);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
  });

  it('should not show password modal and enable biometric modal on disable toggle', fakeAsync(() => {
    component.ionViewDidEnter();
    tick();
    component.form.patchValue({ biometric: false });
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
    expect(loginBiometricActivationModalSpy.enableModal).toHaveBeenCalledTimes(1);
  }));

  it('should unsubscribe when leave', () => {
    component.ionViewDidEnter();
    const completeBiometricSpy = spyOn(component.biometricValueChangesSubscription$, 'unsubscribe').and.callThrough();
    const completeInactivitySpy = spyOn(component.inactivityValueChangesSubscription$, 'unsubscribe').and.callThrough();
    component.ionViewDidLeave();
    expect(completeBiometricSpy).toHaveBeenCalledTimes(1);
    expect(completeInactivitySpy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to wallet change password when ux_go_to_wallet_change_password button is clicked', async () => {
    component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_go_to_wallet_change_password"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/password-change']);
  });

  it('should change session expiration time value when clicking radio button and password is correct', fakeAsync(() => {
    component.ionViewDidEnter();
    tick();
    component.form.patchValue({ inactivity: '5' });
    tick();
    expect(component.form.value.inactivity).toEqual('5');
    expect(appExpirationTimeServiceSpy.set).toHaveBeenCalledOnceWith(5);
  }));

  it('should not change session expiration time when clicking radio button and password is incorrect', fakeAsync(() => {
    passwordSpy.and.resolveTo(false);
    fakeModalController.modifyReturns(null, { data: 'aWrongPassword' });
    component.ionViewDidEnter();
    tick();
    component.form.patchValue({ inactivity: '5' });
    tick();
    expect(component.form.value.inactivity).toEqual('2');
    expect(appExpirationTimeServiceSpy.set).not.toHaveBeenCalledOnceWith(5);
  }));

  it('should not change session expiration time when clicking radio button and closing password modal', fakeAsync(() => {
    passwordSpy.and.rejectWith(new Error('Empty Password'));
    fakeModalController.modifyReturns(null, { data: null });
    component.ionViewDidEnter();
    tick();
    component.form.patchValue({ inactivity: '5' });
    tick();
    expect(component.form.value.inactivity).toEqual('2');
    expect(appExpirationTimeServiceSpy.set).not.toHaveBeenCalledOnceWith(5);
  }));
});
