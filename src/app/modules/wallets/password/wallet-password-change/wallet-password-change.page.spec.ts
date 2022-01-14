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
      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService',
        {
          changePassword: Promise.resolve()
        }
      );

      fakeLoadingService = new FakeLoadingService();
      loadingServiceSpy = fakeLoadingService.createSpy();

      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [WalletPasswordChangePage, FakeTrackClickDirective],
        imports: [ReactiveFormsModule, IonicModule, TranslateModule.forRoot()],
        providers: [UrlSerializer,
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
    // TODO: Bug in errors repeat password
    // {
    //   name: 'required field (password and repeat password)',
    //   data: formData.emptyNewPassword,
    //   errorsOnForm: undefined,
    //   errorsOnOldPassword: undefined,
    //   errorsOnPassword: ['required'],
    //   errorsOnRepeatPassword: ['required'],
    // },
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
  ].forEach(testCase => {
    // TODO: Test too big, divide in smaller tests
    it(`should test for ${testCase.name} errors on form submit`, async () => {
      component.changePasswordForm.patchValue(testCase.data);
      const hasError = !!testCase.errorsOnForm || !!testCase.errorsOnOldPassword || !!testCase.errorsOnPassword || !!testCase.errorsOnRepeatPassword;
      const formSpy = spyOn(component.changePasswordForm, 'markAllAsTouched').and.callThrough();
      const formGroup = component.changePasswordForm;
      const oldPasswordControl = component.changePasswordForm.get('old_password');
      const newPasswordControl = component.changePasswordForm.get('password');
      const repeatPasswordControl = component.changePasswordForm.get('repeat_password');
      spyOn(component, 'changePassword');
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(formGroup.valid).toBe(!hasError);
      if (testCase.errorsOnForm) {
        expect(formGroup.hasError(testCase.errorsOnForm[0])).toBeTrue();
      }

      expect(oldPasswordControl.valid).toBe(!testCase.errorsOnOldPassword);
      if (testCase.errorsOnOldPassword) {
        expect(oldPasswordControl.hasError(testCase.errorsOnOldPassword[0])).toBeTrue();
      }

      expect(newPasswordControl.valid).toBe(!testCase.errorsOnPassword);
      if (testCase.errorsOnPassword) {
        expect(newPasswordControl.hasError(testCase.errorsOnPassword[0])).toBeTrue();
      }

      expect(repeatPasswordControl.valid).toBe(!testCase.errorsOnRepeatPassword);
      if (testCase.errorsOnRepeatPassword) {
        expect(repeatPasswordControl.hasError(testCase.errorsOnRepeatPassword[0])).toBeTrue();
      }

      if (hasError) {
        expect(formSpy).toHaveBeenCalledTimes(1);
      }
    });
  });

  it('should show error message if old password is incorrect', async () => {
    walletEncryptionServiceSpy.changePassword.and.rejectWith();
    component.changePasswordForm.patchValue(formData.valid);
    await component.handleSubmit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(loadingServiceSpy.showModal).toHaveBeenCalledTimes(1);
    expect(walletEncryptionServiceSpy.changePassword).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/password-change/error']);
    expect(loadingServiceSpy.dismissModal).toHaveBeenCalledTimes(1);
  });

  it('should open modal and change password on handleSubmit', async() => {
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
