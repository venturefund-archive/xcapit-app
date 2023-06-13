import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { UserEmailPage } from './user-email.page';
import { RegistrationStatus } from '../enums/registration-status.enum';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';

describe('UserEmailPage', () => {
  let component: UserEmailPage;
  let fixture: ComponentFixture<UserEmailPage>;
  let fiatRampServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let kriptonStorageSpy: jasmine.SpyObj<KriptonStorageService>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;

  const STATUS = Object.keys(RegistrationStatus);

  beforeEach(waitForAsync(() => {
    fiatRampServiceSpy = jasmine.createSpyObj('FiatRampService', {
      getOrCreateUser: of(),
      getKriptonAccessToken: of(),
      kriptonLogin: of({ token: 'someToken', refresh_token: 'refreshToken' }),
    });

    tokenOperationDataServiceSpy = jasmine.createSpyObj(
      'TokenOperationDataService',
      {},
      {
        tokenOperationData: { mode: 'buy' },
      }
    );
    navControllerSpy = new FakeNavController().createSpy();

    kriptonStorageSpy = jasmine.createSpyObj('KriptonStorageService', {
      set: Promise.resolve(),
      get: Promise.resolve('test@test.com'),
    });

    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showSuccessToast: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [UserEmailPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: FiatRampsService, useValue: fiatRampServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: KriptonStorageService, useValue: kriptonStorageSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  STATUS.forEach((registrationStatus) => {
    const URL = RegistrationStatus[registrationStatus];
    it(`should redirect to ${URL} when user status is ${registrationStatus}`, fakeAsync(() => {
      tokenOperationDataServiceSpy.tokenOperationData.mode = 'buy';
      fiatRampServiceSpy.getOrCreateUser.and.returnValue(of({ registration_status: registrationStatus }));
      component.form.patchValue({ email: 'test@test.com', token: '12345' });
      fixture.debugElement.query(By.css('ion-button[name="ux_user_mail_continue"]')).nativeElement.click();
      tick();
      fixture.detectChanges();
      fixture.debugElement.query(By.css('ion-button[name="ux_user_mail_continue"]')).nativeElement.click();
      tick();
      fixture.detectChanges();
      expect(kriptonStorageSpy.set.calls.allArgs()).toEqual([
        ['email', 'test@test.com'],
        ['access_token', 'someToken'],
        ['refresh_token', 'refreshToken'],
        ['user_status', registrationStatus],
      ]);
      expect(fiatRampServiceSpy.getOrCreateUser).toHaveBeenCalledOnceWith({ email: 'test@test.com' });
      expect(fiatRampServiceSpy.getKriptonAccessToken).toHaveBeenCalledOnceWith({ email: 'test@test.com' });
      expect(fiatRampServiceSpy.kriptonLogin).toHaveBeenCalledOnceWith({ email: 'test@test.com', token: '12345' });
      expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(URL);
    }));
  });

  it('', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.form.value.email).toEqual('test@test.com');
  });

  it('should enable timer, show proper footer text and show toast when "Send code request" is clicked and there are attempts left', async () => {
    component.validatedEmail = true;
    await component.ionViewWillEnter();
    component.form.patchValue({ email: 'test@test.com' });
    fixture.detectChanges();
    fixture.whenRenderingDone();
    fixture.debugElement.query(By.css('ion-text[name="Send code request"]')).nativeElement.click();

    expect(toastServiceSpy.showSuccessToast).toHaveBeenCalledTimes(1);
    expect(fiatRampServiceSpy.getKriptonAccessToken).toHaveBeenCalledOnceWith({ email: 'test@test.com' });
    expect(component.resendTitleText).toEqual('fiat_ramps.user_email.resend_email.title_sent');
  });

  it('should disable timer when app-countdown-timer is finished', () => {
    component.validatedEmail = true;
    component.timerEnabled = true;
    spyOn(component, 'disableTimer');
    fixture.detectChanges();
    const componentEl = fixture.debugElement.query(By.css('app-countdown-timer'));
    componentEl.triggerEventHandler('hasFinishedCounting', null);

    expect(component.disableTimer).toHaveBeenCalledTimes(1);
  });

  it('should navigate to create-support-ticket when "Send code request" is clicked and there are no attempts left', () => {
    component.validatedEmail = true;
    component.resendAttempts = 0;
    fixture.detectChanges();
    fixture.whenRenderingDone();
    fixture.debugElement.query(By.css('ion-text[name="Send code request"]')).nativeElement.click();
    expect(fiatRampServiceSpy.getKriptonAccessToken).not.toHaveBeenCalled();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tickets/create-support-ticket']);
  });

  it('should show proper footer text when there are attempts left and timer is disabled', () => {
    component.validatedEmail = true;
    component.resendAttempts = 2;
    component.disableTimer();

    expect(component.resendTitleText).toEqual('fiat_ramps.user_email.resend_email.title_not_sent');
    expect(component.resendLinkText).toEqual('fiat_ramps.user_email.resend_email.link_not_sent');
  });

  it('should show proper footer text when there are no attempts left and timer is disabled', () => {
    component.validatedEmail = true;
    component.resendAttempts = 0;
    component.disableTimer();

    expect(component.resendTitleText).toEqual('fiat_ramps.user_email.resend_email.title_exceeded_attempts');
    expect(component.resendLinkText).toEqual('fiat_ramps.user_email.resend_email.link_exceeded_attempts');
  });

  it('should display the token error when an invalid token is entered and clear it when user enters another token ', fakeAsync(() => {
    fiatRampServiceSpy.kriptonLogin.and.returnValue(throwError('error'));
    fiatRampServiceSpy.getOrCreateUser.and.returnValue(of({ registration_status: 'USER_INFORMATION' }));
    component.form.patchValue({ email: 'test@test.com', token: '1234567' });
    fixture.debugElement.query(By.css('ion-button[name="ux_user_mail_continue"]')).nativeElement.click();
    tick();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_user_mail_continue"]')).nativeElement.click();
    tick();
    fixture.detectChanges();
    expect(true).toBeTrue();
    const errorDescription = fixture.debugElement.query(
      By.css('div.ue__container__form__token_error__description > ion-text')
    );
    expect(errorDescription.nativeElement.innerHTML).toContain('fiat_ramps.user_email.token_error_description');
    component.form.patchValue({ token: '123' });
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('div.ue__container__form__token_error__description > ion-text'))
    ).toBeFalsy();
  }));

  it(`should redirect to user bank account when user status is COMPLETE and mode is sell`, fakeAsync(() => {
    tokenOperationDataServiceSpy.tokenOperationData.mode = 'sell';
    fiatRampServiceSpy.getOrCreateUser.and.returnValue(of({ registration_status: 'COMPLETE' }));
    component.form.patchValue({ email: 'test@test.com', token: '12345' });
    fixture.debugElement.query(By.css('ion-button[name="ux_user_mail_continue"]')).nativeElement.click();
    tick();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_user_mail_continue"]')).nativeElement.click();
    tick();
    fixture.detectChanges();
    expect(kriptonStorageSpy.set.calls.allArgs()).toEqual([
      ['email', 'test@test.com'],
      ['access_token', 'someToken'],
      ['refresh_token', 'refreshToken'],
      ['user_status', 'COMPLETE'],
    ]);
    expect(fiatRampServiceSpy.getOrCreateUser).toHaveBeenCalledOnceWith({ email: 'test@test.com' });
    expect(fiatRampServiceSpy.getKriptonAccessToken).toHaveBeenCalledOnceWith({ email: 'test@test.com' });
    expect(fiatRampServiceSpy.kriptonLogin).toHaveBeenCalledOnceWith({ email: 'test@test.com', token: '12345' });
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('/fiat-ramps/user-bank-account');
  }));
});
