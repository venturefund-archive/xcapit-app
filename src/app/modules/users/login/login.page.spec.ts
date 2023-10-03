import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { ApiUsuariosService } from '../shared-users/services/api-usuarios/api-usuarios.service';
import { AuthFormComponent } from '../shared-users/components/auth-form/auth-form.component';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { Storage } from '@ionic/storage-angular';
import { UpdateNewsService } from '../../../shared/services/update-news/update-news.service';
import { DefaultPlatformService } from '../../../shared/services/platform/default/default-platform.service';
import { NullNotificationsService } from '../../notifications/shared-notifications/services/null-notifications/null-notifications.service';
import { By } from '@angular/platform-browser';
import { WalletConnectService } from '../../wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let apiUsuariosSpy: jasmine.SpyObj<ApiUsuariosService>;
  let subscriptionsServiceSpy: jasmine.SpyObj<SubscriptionsService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<LoginPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;
  let nullNotificationServiceSpy: jasmine.SpyObj<NullNotificationsService>;
  let storageSpy: jasmine.SpyObj<Storage>;
  let updateNewsServiceSpy: jasmine.SpyObj<UpdateNewsService>;
  let platformServiceSpy: jasmine.SpyObj<DefaultPlatformService>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;
  let ionicStorageSpy: jasmine.SpyObj<IonicStorageService>;
  const formData = {
    valid: {
      email: 'test@test.com',
      repeat_email: 'test@test.com',
      password: 'TestPass1234',
      repeat_password: 'TestPass1234',
    },
  };

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    fakeNavController.modifyReturns({}, {}, {}, {}, {});
    ionicStorageSpy = jasmine.createSpyObj(
      'IonicStorageService',
      {
        get: Promise.resolve(true),
        set: Promise.resolve(),
      },
      {}
    );

    apiUsuariosSpy = jasmine.createSpyObj('ApiUsuariosService', {
      login: of({}),
    });

    subscriptionsServiceSpy = jasmine.createSpyObj('SubscriptionsService', {
      checkStoredLink: Promise.resolve(false),
    });

    storageSpy = jasmine.createSpyObj('Storage', {
      get: Promise.resolve(true),
    });

    nullNotificationServiceSpy = jasmine.createSpyObj('NullNotificationsService', ['subscribeTo', 'unsubscribeFrom']);

    notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', {
      getInstance: nullNotificationServiceSpy,
    });

    updateNewsServiceSpy = jasmine.createSpyObj('UpdateNewsService', { showModal: Promise.resolve() });
    platformServiceSpy = jasmine.createSpyObj('PlatformService', { isWeb: true });

    walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', {
      uri: new BehaviorSubject(null),
      checkDeeplinkUrl: Promise.resolve(null),
    });

    TestBed.configureTestingModule({
      declarations: [LoginPage, AuthFormComponent, FakeTrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), ReactiveFormsModule, IonicModule],
      providers: [
        { provide: ApiUsuariosService, useValue: apiUsuariosSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: SubscriptionsService, useValue: subscriptionsServiceSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: UpdateNewsService, useValue: updateNewsServiceSpy },
        { provide: DefaultPlatformService, useValue: platformServiceSpy },
        { provide: WalletConnectService, useValue: walletConnectServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set up on login success without stored link and push notifications activated', fakeAsync(() => {
    const spy = spyOn(component.loginForm.form, 'reset');
    component.loginUser({});
    tick();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(notificationsServiceSpy.getInstance).toHaveBeenCalledTimes(1);
    expect(nullNotificationServiceSpy.subscribeTo).toHaveBeenCalledTimes(1);
    expect(subscriptionsServiceSpy.checkStoredLink).toHaveBeenCalledTimes(1);
  }));

  it('should set up on login success without stored link and push notifications not activated', fakeAsync(() => {
    ionicStorageSpy.get.and.returnValue(Promise.resolve(false));
    const spy = spyOn(component.loginForm.form, 'reset');
    component.loginUser({});
    tick();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(notificationsServiceSpy.getInstance).toHaveBeenCalledTimes(2);
    expect(nullNotificationServiceSpy.subscribeTo).toHaveBeenCalledTimes(1);
    expect(nullNotificationServiceSpy.unsubscribeFrom).toHaveBeenCalledTimes(1);
    expect(subscriptionsServiceSpy.checkStoredLink).toHaveBeenCalledTimes(1);
  }));

  it('should not call startUrl when stored link', fakeAsync(() => {
    const spyStartUrl = spyOn(component, 'startUrl');
    subscriptionsServiceSpy.checkStoredLink.and.returnValue(Promise.resolve(true));

    component.loginUser({});
    tick();

    expect(spyStartUrl).not.toHaveBeenCalled();
  }));

  it('should redirect to first steps when the user is not already onboarded', () => {
    component.alreadyOnboarded = false;
    fixture.detectChanges();

    expect(component.startUrl()).toEqual(['tutorials/first-steps']);
  });

  it('should redirect to home when the user is already onboarded', () => {
    expect(component.startUrl()).toEqual(['tutorials/first-steps']);
  });

  it('should call trackEvent on trackService when Login button clicked', () => {
    fixture.detectChanges();
    component.loginForm.form.patchValue(formData.valid);
    fixture.detectChanges();
    expect(component.loginForm.form.valid).toBeTruthy();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Login');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go To Register button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Register');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Reset Password button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Reset Password');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should disable loading button when login fails', () => {
    apiUsuariosSpy.login.and.returnValue(throwError(''));
    fixture.debugElement.query(By.css('app-auth-form')).triggerEventHandler('send', {
      email: 'email@email.com',
      password: 'asdfF1',
      referral_code: 'asd123',
      tos: true,
    });
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });

  it('should call walletConnectService checkDeeplinkUrl on Success when has a uri defined', fakeAsync(() => {
    subscriptionsServiceSpy.checkStoredLink.and.returnValue(Promise.resolve(false));
    walletConnectServiceSpy.uri = new BehaviorSubject('wc:///');
    component.alreadyOnboarded = true;
    fixture.detectChanges();
    component.loginUser({});
    tick();

    expect(walletConnectServiceSpy.checkDeeplinkUrl).toHaveBeenCalled();
  }));

  it('should check if wallet is protected on login, and if not protected, set backupWarningWallet for modal', fakeAsync(() => {
    ionicStorageSpy.get.and.returnValue(Promise.resolve(false));
    fixture.debugElement.query(By.css('app-auth-form')).triggerEventHandler('send', formData.valid);
    tick();

    expect(ionicStorageSpy.set).toHaveBeenCalledOnceWith('backupWarningWallet', true);
  }));

  it('should check if wallet is protected on login, and if protected, ignore backupWarningWarning', fakeAsync(() => {
    fixture.debugElement.query(By.css('app-auth-form')).triggerEventHandler('send', formData.valid);
    tick();

    expect(ionicStorageSpy.set).toHaveBeenCalledTimes(0);
  }));
});
