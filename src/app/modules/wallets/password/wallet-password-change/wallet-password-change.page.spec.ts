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
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

const formData = {
  valid: {
    old_password: 'oldTestPassword0',
    password: 'newTestPassword0',
    repeat_password: 'newTestPassword0',
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
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletPasswordChangePage>;

  beforeEach(
    waitForAsync(() => {
      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
        changePassword: Promise.resolve(),
      });

      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [WalletPasswordChangePage, FakeTrackClickDirective],
        imports: [ReactiveFormsModule, IonicModule, TranslateModule.forRoot()],
        providers: [
          UrlSerializer,
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
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
    let newPasswordControl: any;
    let repeatPasswordControl: any;
    let changePasswordSpy: jasmine.Spy;

    beforeEach(() => {
      markAllAsTouchedSpy = spyOn(component.changePasswordForm, 'markAllAsTouched').and.callThrough();
      formGroup = component.changePasswordForm;
      newPasswordControl = component.changePasswordForm.get('password');
      repeatPasswordControl = component.changePasswordForm.get('repeat_password');
      changePasswordSpy = spyOn(component, 'changePassword');
    });

    it(`should have no errors on valid form on form submit`, async () => {
      component.changePasswordForm.patchValue(formData.valid);
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(formGroup.valid).toBeTrue();
      expect(markAllAsTouchedSpy).toHaveBeenCalledTimes(0);
      expect(changePasswordSpy).toHaveBeenCalledTimes(1);
    });

    it(`should have hasNumber error on password on form submit`, async () => {
      component.changePasswordForm.patchValue(formData.hasNumber);
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(newPasswordControl.hasError('hasNumber')).toBeTrue();
      expect(markAllAsTouchedSpy).toHaveBeenCalledTimes(1);
      expect(changePasswordSpy).toHaveBeenCalledTimes(0);
    });

    it(`should have hasCapitalCase error on password on form submit`, async () => {
      component.changePasswordForm.patchValue(formData.hasCapitalCase);
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(newPasswordControl.hasError('hasCapitalCase')).toBeTrue();
      expect(markAllAsTouchedSpy).toHaveBeenCalledTimes(1);
      expect(changePasswordSpy).toHaveBeenCalledTimes(0);
    });

    it(`should have hasSmallCase error on password on form submit`, async () => {
      component.changePasswordForm.patchValue(formData.hasSmallCase);
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(newPasswordControl.hasError('hasSmallCase')).toBeTrue();
      expect(markAllAsTouchedSpy).toHaveBeenCalledTimes(1);
      expect(changePasswordSpy).toHaveBeenCalledTimes(0);
    });

    it(`should have noPasswordMatch error on password on form submit`, async () => {
      component.changePasswordForm.patchValue(formData.newPasswordDoesNotMatch);
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(formGroup.hasError('noPasswordMatch')).toBeTrue();
      expect(repeatPasswordControl.hasError('noPasswordMatch')).toBeTrue();
      expect(markAllAsTouchedSpy).toHaveBeenCalledTimes(1);
      expect(changePasswordSpy).toHaveBeenCalledTimes(0);
    });

    it(`should have newPasswordMatchesOld error on password on form submit`, async () => {
      component.changePasswordForm.patchValue(formData.newPasswordMatchesOldPassword);
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(formGroup.hasError('newPasswordMatchesOld')).toBeTrue();
      expect(newPasswordControl.hasError('newPasswordMatchesOld')).toBeTrue();
      expect(markAllAsTouchedSpy).toHaveBeenCalledTimes(1);
      expect(changePasswordSpy).toHaveBeenCalledTimes(0);
    });
  });

  it('should show error message if old password is incorrect', async () => {
    walletEncryptionServiceSpy.changePassword.and.rejectWith(new Error('invalid password'));
    component.changePasswordForm.patchValue(formData.valid);
    await component.handleSubmit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(walletEncryptionServiceSpy.changePassword).toHaveBeenCalledTimes(1);
    expect(component.changePasswordForm.get('old_password').hasError('walletIncorrectPassword')).toBeTrue();
  });

  it('should go to Error Page if something failed', async () => {
    walletEncryptionServiceSpy.changePassword.and.rejectWith(new Error());
    component.changePasswordForm.patchValue(formData.valid);
    await component.handleSubmit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(walletEncryptionServiceSpy.changePassword).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/password-change/error']);
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
