import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { WalletPasswordChangePage } from './wallet-password-change.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { WalletEncryptionService } from '../../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { FakeLoadingService } from 'src/testing/fakes/loading.fake.spec';

const formData = {
  valid: {
    old_password: 'oldTestPassword0',
    password: 'newTestPassword0',
    repeat_password: 'newTestPassword0',
  },
  emptyOldPassword: {
    old_password: '',
    password: 'newTestPassword0',
    repeat_password: 'newTestPassword0',
  },
  emptyNewPassword: {
    old_password: 'oldTestPassword0',
    password: '',
    repeat_password: '',
  },
  hasNumber: {
    old_password: 'oldTestPassword0',
    password: 'newTestPassword',
    repeat_password: 'newTestPassword',
  },
  hasCapitalCase: {
    old_password: 'oldTesrPassword0',
    password: 'newtestpassword0',
    repeat_password: 'newtestpassword0',
  },
  hasSmallCase: {
    old_password: 'oldTestPassword0',
    password: 'NEWTESTPASSWORD0',
    repeat_password: 'NEWTESTPASSWORD0',
  },
  minlength: {
    old_password: 'oldTestPassword0',
    password: 'Test0',
    repeat_password: 'Test0',
  },
  maxlength: {
    old_password: 'oldTestPassword0',
    password: 'veryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLongPassword0',
    repeat_password:
      'veryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLongPassword0',
  },
  newPasswordDoesNotMatch: {
    old_password: 'oldTestPassword0',
    password: 'newTestPassword0',
    repeat_password: 'newTestPassword1',
  },
  newPasswordMatchesOldPassword: {
    old_password: 'oldTestPassword0',
    password: 'oldTestPassword0',
    repeat_password: 'oldTestPassword0',
  },
};

describe('WalletPasswordChangePage', () => {
  let component: WalletPasswordChangePage;
  let fixture: ComponentFixture<WalletPasswordChangePage>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let fakeLoadingService: FakeLoadingService;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletPasswordChangePage>;

  beforeEach(
    waitForAsync(() => {
      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
        changePassword: Promise.resolve(),
      });

      fakeLoadingService = new FakeLoadingService();
      loadingServiceSpy = fakeLoadingService.createSpy();

      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [WalletPasswordChangePage, FakeTrackClickDirective],
        imports: [ReactiveFormsModule, IonicModule, TranslateModule.forRoot()],
        providers: [
          UrlSerializer,
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: LoadingService, useValue: loadingServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletPasswordChangePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Errors', () => {
    let markAllAsTouchedSpy: jasmine.Spy;
    let formGroup: any;
    let oldPasswordControl: any;
    let newPasswordControl: any;
    let repeatPasswordControl: any;

    beforeEach(() => {
      markAllAsTouchedSpy = spyOn(component.changePasswordForm, 'markAllAsTouched').and.callThrough();
      formGroup = component.changePasswordForm;
      oldPasswordControl = component.changePasswordForm.get('old_password');
      newPasswordControl = component.changePasswordForm.get('password');
      repeatPasswordControl = component.changePasswordForm.get('repeat_password');
      spyOn(component, 'changePassword');
    });

    [
      {
        name: 'no',
        data: formData.valid,
        errorsOnForm: undefined,
        errorsOnOldPassword: undefined,
        errorsOnPassword: undefined,
        errorsOnRepeatPassword: undefined,
      },
      {
        name: 'required field (old password)',
        data: formData.emptyOldPassword,
        errorsOnForm: undefined,
        errorsOnOldPassword: ['required'],
        errorsOnPassword: undefined,
        errorsOnRepeatPassword: undefined,
      },
      {
        name: 'required field (password and repeat password)',
        data: formData.emptyNewPassword,
        errorsOnForm: undefined,
        errorsOnOldPassword: undefined,
        errorsOnPassword: ['required'],
        errorsOnRepeatPassword: undefined,
      },
      {
        name: 'hasNumber password',
        data: formData.hasNumber,
        errorsOnForm: undefined,
        errorsOnOldPassword: undefined,
        errorsOnPassword: ['hasNumber'],
        errorsOnRepeatPassword: undefined,
      },
      {
        name: 'hasCapitalCase password',
        data: formData.hasCapitalCase,
        errorsOnForm: undefined,
        errorsOnOldPassword: undefined,
        errorsOnPassword: ['hasCapitalCase'],
        errorsOnRepeatPassword: undefined,
      },
      {
        name: 'hasSmallCase password',
        data: formData.hasSmallCase,
        errorsOnForm: undefined,
        errorsOnOldPassword: undefined,
        errorsOnPassword: ['hasSmallCase'],
        errorsOnRepeatPassword: undefined,
      },
      {
        name: 'minlength password',
        data: formData.minlength,
        errorsOnForm: undefined,
        errorsOnOldPassword: undefined,
        errorsOnPassword: ['minlength'],
        errorsOnRepeatPassword: undefined,
      },
      {
        name: 'maxlength password',
        data: formData.maxlength,
        errorsOnForm: undefined,
        errorsOnOldPassword: undefined,
        errorsOnPassword: ['maxlength'],
        errorsOnRepeatPassword: undefined,
      },
      {
        name: 'noPasswordMatch',
        data: formData.newPasswordDoesNotMatch,
        errorsOnForm: ['noPasswordMatch'],
        errorsOnOldPassword: undefined,
        errorsOnPassword: undefined,
        errorsOnRepeatPassword: ['noPasswordMatch'],
      },
      {
        name: 'newPasswordMatchesOld',
        data: formData.newPasswordMatchesOldPassword,
        errorsOnForm: ['newPasswordMatchesOld'],
        errorsOnOldPassword: undefined,
        errorsOnPassword: ['newPasswordMatchesOld'],
        errorsOnRepeatPassword: undefined,
      },
    ].forEach((testCase) => {
      if (testCase.errorsOnForm) {
        it(`should have ${testCase.name} errors on form group on form submit`, async () => {
          component.changePasswordForm.patchValue(testCase.data);
          fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
          fixture.detectChanges();
          await fixture.whenStable();
          expect(formGroup.valid).toBeFalse();
          expect(formGroup.hasError(testCase.errorsOnForm[0])).toBeTrue();
        });
      }

      if (testCase.errorsOnOldPassword) {
        it(`should have ${testCase.name} errors on old_password field on form submit`, async () => {
          component.changePasswordForm.patchValue(testCase.data);
          fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
          fixture.detectChanges();
          await fixture.whenStable();
          expect(oldPasswordControl.valid).toBeFalse();
          expect(oldPasswordControl.hasError(testCase.errorsOnOldPassword[0])).toBeTrue();
        });
      }

      if (testCase.errorsOnPassword) {
        it(`should have ${testCase.name} errors on password field on form submit`, async () => {
          component.changePasswordForm.patchValue(testCase.data);
          fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
          fixture.detectChanges();
          await fixture.whenStable();
          expect(newPasswordControl.valid).toBeFalse();
          expect(newPasswordControl.hasError(testCase.errorsOnPassword[0])).toBeTrue();
        });
      }

      if (testCase.errorsOnRepeatPassword) {
        it(`should have ${testCase.name} errors on repeat_password field on form submit`, async () => {
          component.changePasswordForm.patchValue(testCase.data);
          fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
          fixture.detectChanges();
          await fixture.whenStable();
          expect(repeatPasswordControl.valid).toBeFalse();
          expect(repeatPasswordControl.hasError(testCase.errorsOnRepeatPassword[0])).toBeTrue();
        });
      }

      if (
        !!testCase.errorsOnForm ||
        !!testCase.errorsOnOldPassword ||
        !!testCase.errorsOnPassword ||
        !!testCase.errorsOnRepeatPassword
      ) {
        it(`should show ${testCase.name} errors message on form submit`, async () => {
          component.changePasswordForm.patchValue(testCase.data);
          fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
          fixture.detectChanges();
          await fixture.whenStable();
          expect(markAllAsTouchedSpy).toHaveBeenCalledTimes(1);
        });
      }
    });
  });

  it('should show error message if old password is incorrect', async () => {
    walletEncryptionServiceSpy.changePassword.and.rejectWith(new Error('invalid password'));
    component.changePasswordForm.patchValue(formData.valid);
    await component.handleSubmit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(loadingServiceSpy.showModal).toHaveBeenCalledTimes(1);
    expect(walletEncryptionServiceSpy.changePassword).toHaveBeenCalledTimes(1);
    expect(component.changePasswordForm.get('old_password').hasError('walletIncorrectPassword')).toBeTrue();
    expect(loadingServiceSpy.dismissModal).toHaveBeenCalledTimes(1);
  });

  it('should go to Error Page if something failed', async () => {
    walletEncryptionServiceSpy.changePassword.and.rejectWith(new Error());
    component.changePasswordForm.patchValue(formData.valid);
    await component.handleSubmit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(loadingServiceSpy.showModal).toHaveBeenCalledTimes(1);
    expect(walletEncryptionServiceSpy.changePassword).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/password-change/error']);
    expect(loadingServiceSpy.dismissModal).toHaveBeenCalledTimes(1);
  });

  it('should open modal and change password on handleSubmit', async () => {
    component.changePasswordForm.patchValue(formData.valid);
    await component.handleSubmit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(loadingServiceSpy.showModal).toHaveBeenCalledTimes(1);
    expect(walletEncryptionServiceSpy.changePassword).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/password-change/success']);
    expect(loadingServiceSpy.dismissModal).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Submit button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Submit');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent').and.returnValue(null);
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
