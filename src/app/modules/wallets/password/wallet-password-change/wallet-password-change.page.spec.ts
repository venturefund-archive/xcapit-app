import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { WalletPasswordChangePage } from './wallet-password-change.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { UrlSerializer } from '@angular/router';

const formData = {
  valid: {
    old_password: 'oldTestPassword0',
    password: 'newTestPassword0',
    repeat_password: 'newTestPassword0',
  },
  emptyForm: {
    old_password: '',
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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WalletPasswordChangePage],
        imports: [ReactiveFormsModule, IonicModule, TranslateModule.forRoot()],
        providers: [UrlSerializer],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletPasswordChangePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable Submit button if form is valid', () => {
    component.changePasswordForm.patchValue(formData.valid);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('ion-button[name="Submit"]'));
    expect(button.attributes['ng-reflect-disabled']).toBeFalsy();
    expect(component.changePasswordForm.valid).toBeTrue();
  });

  it('should show required field errors and disable Submit button if form is empty', () => {
    component.changePasswordForm.patchValue(formData.emptyForm);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('ion-button[name="Submit"]'));
    expect(button.attributes['ng-reflect-disabled']).toBeTruthy();
    expect(component.changePasswordForm.valid).toBeFalse();
    expect(component.changePasswordForm.get('old_password').hasError('required')).toBeTrue();
    expect(component.changePasswordForm.get('repeat_password').hasError('required')).toBeTrue();

    component.changePasswordForm.patchValue(formData.valid);
    component.changePasswordForm.patchValue({ password: '', repeat_password: '' });
    fixture.detectChanges();
    expect(button.attributes['ng-reflect-disabled']).toBeTruthy();
    expect(component.changePasswordForm.valid).toBeFalse();
    expect(component.changePasswordForm.get('password').hasError('required')).toBeTrue();
  });

  ['hasNumber', 'hasCapitalCase', 'hasSmallCase', 'minlength', 'maxlength'].forEach((error) => {
    it(`should show ${error} password errors and disable Submit button if form is empty`, () => {
      component.changePasswordForm.patchValue(formData[error]);
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('ion-button[name="Submit"]'));
      expect(button.attributes['ng-reflect-disabled']).toBeTruthy();
      expect(component.changePasswordForm.valid).toBeFalse();
      expect(component.changePasswordForm.get('password').hasError(error)).toBeTrue();
    });
  });

  it('should show error message and disable Submit button if new password and repeat password do not match', () => {
    component.changePasswordForm.patchValue(formData.newPasswordDoesNotMatch);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('ion-button[name="Submit"]'));
    expect(button.attributes['ng-reflect-disabled']).toBeTruthy();
    expect(component.changePasswordForm.valid).toBeFalse();
    expect(component.changePasswordForm.get('password').hasError('noPasswordMatch')).toBeTrue();
    expect(component.changePasswordForm.hasError('noPasswordMatch')).toBeTrue();
  });

  it('should show error message and disable Submit button if old password and new password match', () => {
    component.changePasswordForm.patchValue(formData.newPasswordMatchesOldPassword);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('ion-button[name="Submit"]'));
    expect(button.attributes['ng-reflect-disabled']).toBeTruthy();
    expect(component.changePasswordForm.valid).toBeFalse();
    expect(component.changePasswordForm.get('password').hasError('newPasswordMatchesOld')).toBeTrue();
    expect(component.changePasswordForm.hasError('newPasswordMatchesOld')).toBeTrue();
  });

  it('should show error message if old password is incorrect', () => {});

  it('should disable Submit button after it was pressed', () => {});
});
