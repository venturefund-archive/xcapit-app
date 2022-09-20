import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { LoginNewPage } from './login-new.page';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeBiometricAuth } from 'src/app/shared/models/biometric-auth/fake/fake-biometric-auth';
import { BiometricAuthInjectable } from 'src/app/shared/models/biometric-auth/injectable/biometric-auth-injectable';


describe('LoginNewPage', () => {
  const aPassword = 'aPassword';
  const aHashedPassword = 'iRJ1cT5x4V2jlpnVB0gp3bXdN4Uts3EAz4njSxGUNNqOGdxdWpjiTTWLOIAUp+6ketRUhjoRZBS8bpW5QnTnRA==';
  let component: LoginNewPage;
  let fixture: ComponentFixture<LoginNewPage>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<LoginNewPage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let biometricAuthInjectableSpy: jasmine.SpyObj<BiometricAuthInjectable>;
  beforeEach(waitForAsync(() => {
    biometricAuthInjectableSpy = jasmine.createSpyObj('BiometricAuthInjectable', {
      create: new FakeBiometricAuth()
    });
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showErrorToast: Promise.resolve(),
      dismiss: Promise.resolve(),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(aHashedPassword),
      set: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      declarations: [LoginNewPage,  FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: BiometricAuthInjectable, useValue: biometricAuthInjectableSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login with biometric auth when is enabled', fakeAsync (() => {
    biometricAuthInjectableSpy.create.and.returnValue(
      new FakeBiometricAuth(Promise.resolve(true), Promise.resolve(true), Promise.resolve(true), null, Promise.resolve(aPassword))
    );
    component.ionViewWillEnter();
    tick();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tabs/wallets', { replaceUrl: true });
  }));

  it('should login when password is ok', async () => {
    component.form.patchValue({ password: aPassword });

    await component.handleSubmit(false);

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tabs/wallets', { replaceUrl: true });
  });

  it('should show error toast when password is not ok', async () => {
    component.form.patchValue({ password: 'anInvalidPassword' });

    await component.handleSubmit(false);

    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
      message: 'users.login_new.invalid_password_text',
      duration: 8000,
    });
  });


  it('should dismiss modal when input is clicked', () => {
    fixture.debugElement.query(By.css('app-ux-input[controlName="password"]')).nativeElement.click();
    expect(toastServiceSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should access to faqs when help button is clicked', async () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_login_help');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/support/options');
  });

  it('should call trackEvent on trackService when forget_password clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_recover_password');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/users/recovery-info');
  });  

  it('should show informative password modal when info button is clicked', async () => {
    fixture.debugElement.query(By.css('app-ux-input')).triggerEventHandler('infoIconClicked', undefined);
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
