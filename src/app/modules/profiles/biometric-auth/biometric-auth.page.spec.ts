import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BiometricAuthInjectable } from 'src/app/shared/models/biometric-auth/injectable/biometric-auth.injectable';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { BiometricAuthPage } from './biometric-auth.page';
import { FakeBiometricAuth } from '../../../shared/models/biometric-auth/fake/fake-biometric-auth';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { LoginBiometricActivationModalService } from '../../users/shared-users/services/login-biometric-activation-modal-service/login-biometric-activation-modal.service';

describe('BiometricAuthPage', () => {
  let component: BiometricAuthPage;
  let fixture: ComponentFixture<BiometricAuthPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let biometricAuthInjectableSpy: jasmine.SpyObj<BiometricAuthInjectable>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let loginBiometricActivationModalSpy: jasmine.SpyObj<LoginBiometricActivationModalService>;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController(null, { data: 'fake_password' });
    modalControllerSpy = fakeModalController.createSpy();
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    toastServiceSpy = jasmine.createSpyObj('ToastService', { showErrorToast: Promise.resolve() });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(false),
      set: Promise.resolve(),
    });
    biometricAuthInjectableSpy = jasmine.createSpyObj('BiometricAuthInjectable', {
      create: new FakeBiometricAuth(),
    });
    loginBiometricActivationModalSpy = jasmine.createSpyObj('LoginBiometricActivationModalService', {
      enableModal: Promise.resolve()
    });
    TestBed.configureTestingModule({
      declarations: [BiometricAuthPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: BiometricAuthInjectable, useValue: biometricAuthInjectableSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: LoginBiometricActivationModalService, useValue: loginBiometricActivationModalSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BiometricAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly texts and toggle', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();
    const [label1, label2] = fixture.debugElement.queryAll(By.css('.ba__toggle__labels ion-text'));
    const toggle = fixture.debugElement.query(By.css('ion-toggle[name="ux_create_all"]'));
    expect(label1.nativeElement.innerHTML).toContain('profiles.biometric_auth.toggle_text');
    expect(label2.nativeElement.innerHTML).toContain('profiles.biometric_auth.toggle_description');
    expect(toggle).toBeTruthy();
  });

  it('should set toggle on enter', async () => {
    await component.ionViewDidEnter();
    expect(component.form.value.biometric).toBeTrue();
  });

  it('should unsubscribe when leave', () => {
    const nextSpy = spyOn(component.leave$, 'next');
    const completeSpy = spyOn(component.leave$, 'complete');
    component.ionViewWillLeave();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should show password modal on enable toggle', fakeAsync(() => {
    component.ionViewDidEnter();
    tick();
    component.toggle(true);
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

  it('should not show password modal on disable toggle', fakeAsync(() => {
    component.ionViewDidEnter();
    tick();
    component.toggle(false);
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  }));

  it('should enable biometric modal on disable toggle', async () => {
    component.ionViewDidEnter();
    component.toggle(false);
    expect(loginBiometricActivationModalSpy.enableModal).toHaveBeenCalledTimes(1);
  })
});
