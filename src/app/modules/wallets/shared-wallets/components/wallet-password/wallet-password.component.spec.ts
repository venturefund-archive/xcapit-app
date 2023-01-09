import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { WalletPasswordComponent } from './wallet-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { BiometricAuthInjectable } from '../../../../../shared/models/biometric-auth/injectable/biometric-auth-injectable';
import { FakeBiometricAuth } from '../../../../../shared/models/biometric-auth/fake/fake-biometric-auth';
import { RemoteConfigService } from '../../../../../shared/services/remote-config/remote-config.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { FakeModalController } from '../../../../../../testing/fakes/modal-controller.fake.spec';

describe('WalletPasswordComponent', () => {
  let component: WalletPasswordComponent;
  let fixture: ComponentFixture<WalletPasswordComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletPasswordComponent>;
  let biometricAuthInjectableSpy: jasmine.SpyObj<BiometricAuthInjectable>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    toastServiceSpy = jasmine.createSpyObj('ToastService', { showInfoToast: Promise.resolve() });
    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', { getFeatureFlag: true });
    biometricAuthInjectableSpy = jasmine.createSpyObj('BiometricAuthInjectable', {
      create: new FakeBiometricAuth(),
    });

    TestBed.configureTestingModule({
      declarations: [WalletPasswordComponent, FakeTrackClickDirective],
      imports: [IonicModule, ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: BiometricAuthInjectable, useValue: biometricAuthInjectableSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletPasswordComponent);
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
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith('testPass');
  });

  it('should not call modal controller dismiss on Confirm Password button is clicked and form is invalid', async () => {
    component.form.patchValue({ password: '' });
    fixture.detectChanges();
    await fixture.whenStable();
    await component.handleSubmit();
    expect(modalControllerSpy.dismiss).not.toHaveBeenCalled();
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

  it('should set biometric enabled', async () => {
    await component.ngOnInit();
    expect(component.biometricEnabled).toBeTrue();
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
});
