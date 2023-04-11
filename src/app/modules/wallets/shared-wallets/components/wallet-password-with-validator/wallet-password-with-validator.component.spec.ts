import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { WalletPasswordWithValidatorComponent } from './wallet-password-with-validator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeBiometricAuth } from '../../../../../shared/models/biometric-auth/fake/fake-biometric-auth';
import { RemoteConfigService } from '../../../../../shared/services/remote-config/remote-config.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { FakeModalController } from '../../../../../../testing/fakes/modal-controller.fake.spec';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { LoginToken } from 'src/app/modules/users/shared-users/models/login-token/login-token';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { BiometricAuthInjectable } from 'src/app/shared/models/biometric-auth/injectable/biometric-auth.injectable';
import { TrackService } from 'src/app/shared/services/track/track.service';

describe('WalletPasswordWithValidatorComponent', () => {
  let component: WalletPasswordWithValidatorComponent;
  let fixture: ComponentFixture<WalletPasswordWithValidatorComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletPasswordWithValidatorComponent>;
  let biometricAuthInjectableSpy: jasmine.SpyObj<BiometricAuthInjectable>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  let storageSpy: jasmine.SpyObj<IonicStorageService>; 
  let loginTokenSpy: jasmine.Spy;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    toastServiceSpy = jasmine.createSpyObj('ToastService', { showInfoToast: Promise.resolve() });
    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', { getFeatureFlag: true });
    biometricAuthInjectableSpy = jasmine.createSpyObj('BiometricAuthInjectable', {
      create: new FakeBiometricAuth(),
    });
    storageSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(),
    });
    loginTokenSpy = spyOn(LoginToken.prototype, 'valid').and.resolveTo(true);

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    TestBed.configureTestingModule({
      declarations: [WalletPasswordWithValidatorComponent, FakeTrackClickDirective],
      imports: [IonicModule, ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: BiometricAuthInjectable, useValue: biometricAuthInjectableSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: IonicStorageService, useValue: storageSpy },
        { provide: TrackService, useValue: trackServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletPasswordWithValidatorComponent);
    component = fixture.componentInstance;
    component.state = 'test_state';
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call modal controller dismiss on Confirm Password button is clicked and form is valid', async () => {
    component.form.patchValue({ password: 'testPass' });
    fixture.debugElement.query(By.css('ion-button[name="Confirm Password"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    await component.handleSubmit();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith(new Password('testPass'));
  });

  it('should disable button on empty password', async () => {
    await component.ngOnInit();
    component.form.patchValue({ password: '' });
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Confirm Password"]'));
    expect(buttonEl.attributes['ng-reflect-disabled']).toEqual('true');
    expect(component.form.get('password').hasError('required')).toBeTrue();
  });

  it('should show invalid password error and not close modal', async () => {
    loginTokenSpy.and.resolveTo(false);
    await component.ngOnInit();
    component.form.patchValue({ password: 'test' });
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form.wp__form')).triggerEventHandler('ngSubmit', null);
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).not.toHaveBeenCalled();
    expect(component.form.get('password').hasError('walletIncorrectPassword')).toBeTrue();
  });

  it('should call trackEvent on trackService when Confirm Password button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Confirm Password');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Close Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close modal when close button is clicked', async () => {
    fixture.debugElement.query(By.css("ion-button[name='Close']")).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should set default event name', async () => {
    component.state = undefined;
    await component.ngOnInit();
    expect(component.trackClickEventName).toEqual('Confirm Password');
  });

  it('should call customEvent on trackService when provided, no state is declared and Confirm Password button clicked', async () => {
    component.state = undefined;
    component.customEvent = 'new_custom_event'
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Confirm Password');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(component.trackClickEventName).toEqual('new_custom_event');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set biometric enabled', async () => {
    await component.ngOnInit();
    expect(component.isBiometricEnabled).toBeTrue();
  });

  it('should handle submit when valid biometric data', async () => {
    biometricAuthInjectableSpy.create.and.returnValue(
      new FakeBiometricAuth(
        Promise.resolve(true),
        Promise.resolve(true),
        Promise.resolve({
          verified: true,
        })
      )
    );
    await component.ngOnInit();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should show toast when invalid biometric data', async () => {
    biometricAuthInjectableSpy.create.and.returnValue(
      new FakeBiometricAuth(
        Promise.resolve(true),
        Promise.resolve(true),
        Promise.resolve({
          verified: false,
          message: 'Authentication failed.',
        })
      )
    );
    await component.ngOnInit();
    expect(toastServiceSpy.showInfoToast).toHaveBeenCalledTimes(1);
  });

  it('should not render use-biometric button when bio-auth is not enabled ', async () => {
    biometricAuthInjectableSpy.create.and.returnValue(
      new FakeBiometricAuth(
        Promise.resolve(true),
        Promise.resolve(false),
      )
    );
    await component.ngOnInit();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Use Biometric Data Password Modal"]'));
    expect(buttonEl).toBeFalsy();
  });

  it('should track event when biometric auth is verified ', async () => {
    biometricAuthInjectableSpy.create.and.returnValue(
      new FakeBiometricAuth(
        Promise.resolve(true),
        Promise.resolve(true),
        Promise.resolve({
          verified: true,
        })
      )
    );
    await component.ngOnInit();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

});
