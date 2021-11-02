import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';

import { WalletPasswordSmallComponent } from './wallet-password-small.component';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';
import { By } from '@angular/platform-browser';
import { FakeModalController } from '../../../../../../testing/fakes/modal-controller.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';
import { WalletEncryptionService } from '../../services/wallet-encryption/wallet-encryption.service';
import { WalletMnemonicService } from '../../services/wallet-mnemonic/wallet-mnemonic.service';

describe('WalletPasswordSmallComponent', () => {
  let component: WalletPasswordSmallComponent;
  let fixture: ComponentFixture<WalletPasswordSmallComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletPasswordSmallComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let walletMnemonicServiceSpy: jasmine.SpyObj<WalletMnemonicService>;

  beforeEach(
    waitForAsync(() => {
      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
        getDecryptedWallet: Promise.resolve({}),
      });

      walletMnemonicServiceSpy = jasmine.createSpyObj(
        'WalletMnemonicService',
        {
          getMnemonic: Promise.resolve({ locale: 'en', path: '', phrase: 'test mnemonic phrase' }),
        },
        {
          mnemonic: undefined,
        }
      );

      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      TestBed.configureTestingModule({
        declarations: [WalletPasswordSmallComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: NavController, useValue: fakeNavController },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(WalletPasswordSmallComponent);

      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to Recovery Phrase Read Page when user password is correct', async () => {
    component.form.patchValue({ password: 'testPassword' });
    fixture.debugElement.query(By.css("ion-button[name='Confirm Password']")).nativeElement.click();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/recovery/read']);
    expect(walletMnemonicServiceSpy.getMnemonic).toHaveBeenCalledTimes(1);
  });

  it('should show error when user password is incorrect', async () => {
    walletEncryptionServiceSpy.getDecryptedWallet.and.rejectWith('Error');
    component.form.patchValue({ password: 'testPassword' });
    fixture.debugElement.query(By.css("ion-button[name='Confirm Password']")).nativeElement.click();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).not.toHaveBeenCalled();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
    expect(walletMnemonicServiceSpy.getMnemonic).not.toHaveBeenCalled();
  });

  it('should call trackEvent on trackService when Accept Button clicked', () => {
    component.form.patchValue({ password: 'testPassword' });
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Confirm Password');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call modal controller dismiss on Confirm Password button is clicked and form is invalid', async () => {
    component.form.patchValue({ password: '' });
    fixture.detectChanges();
    await fixture.whenStable();
    await component.handleSubmit();
    expect(modalControllerSpy.dismiss).not.toHaveBeenCalled();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
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
});
