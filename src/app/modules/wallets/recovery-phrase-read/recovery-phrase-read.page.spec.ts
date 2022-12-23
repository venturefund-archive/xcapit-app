import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { RecoveryPhraseReadPage } from './recovery-phrase-read.page';
import { Mnemonic } from '@ethersproject/hdnode';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { PasswordErrorMsgs } from '../../swaps/shared-swaps/models/password/password-error-msgs';

const testMnemonic: Mnemonic = {
  locale: 'en',
  path: '',
  phrase: 'test phrase other word number another rooster keyboard confort destroy jingle july',
};

describe('RecoveryPhraseReadPage', () => {
  const invalidPasswordError = new Error(new PasswordErrorMsgs().invalid());
  let component: RecoveryPhraseReadPage;
  let fixture: ComponentFixture<RecoveryPhraseReadPage>;
  let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RecoveryPhraseReadPage>;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: any;
  let walletMnemonicServiceSpy: jasmine.SpyObj<WalletMnemonicService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);

      clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', { write: Promise.resolve() });

      toastServiceSpy = jasmine.createSpyObj('ToastService', {
        showInfoToast: Promise.resolve(),
        showErrorToast: Promise.resolve(),
      });

      storageSpy = jasmine.createSpyObj('IonicStorageService', {
        set: Promise.resolve(),
        get: Promise.resolve(false),
        remove: Promise.resolve(),
      });

      walletMnemonicServiceSpy = jasmine.createSpyObj('WalletMnemonicService', {
        importMnemonic: '',
      });
      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
        getDecryptedERC20Wallet: Promise.resolve(jasmine.createSpyObj('Wallet', {}, { mnemonic: testMnemonic })),
      });
      TestBed.configureTestingModule({
        declarations: [RecoveryPhraseReadPage, FakeTrackClickDirective],
        imports: [RouterTestingModule, IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          TranslateService,
          { provide: ClipboardService, useValue: clipboardServiceSpy },
          { provide: ToastService, useValue: toastServiceSpy },
          { provide: IonicStorageService, useValue: storageSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(RecoveryPhraseReadPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable Continue button if phrase was not revealed', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_protect_continue_phrase"]'));
    expect(buttonEl.properties.disabled).toBeTrue();
  });

  it('should disable Continue button if phrase are revealed and go to verify phrase', async () => {
    await component.ionViewDidEnter();
    component.isRevealed = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_protect_continue_phrase"]'));
    buttonEl.nativeElement.click();
    expect(buttonEl.properties.disabled).toBeFalse();
  });

  it('should call trackEvent on trackService when continue is clicked', () => {
    component.isRevealed = true;
    component.mnemonic = testMnemonic;
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_protect_continue_phrase');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to verify phrase if Continue button was clicked', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    component.isRevealed = true;
    component.mnemonic = testMnemonic;
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_protect_continue_phrase"]'));
    buttonEl.nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/create-first/verify-phrase']);
  });

  it('should reveal phrase, copy to clipboard, show toast and change button on Copy Button click', async () => {
    storageSpy.get.and.returnValue(Promise.resolve(true));
    fakeModalController.modifyReturns({}, { data: 'testPass' });
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await component.copyPhrase();
    await fixture.whenStable();
    expect(clipboardServiceSpy.write).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showInfoToast).toHaveBeenCalledTimes(1);
    expect(component.buttonColor).toEqual('secondary');
    expect(component.buttonFill).toEqual('solid');
  });

  it('should not reveal phrase, not copy to clipboard, show toast on Copy Button click and wrong password', async () => {
    storageSpy.get.and.returnValue(Promise.resolve(true));
    fakeModalController.modifyReturns({}, { data: 'testPass' });
    walletEncryptionServiceSpy.getDecryptedERC20Wallet.and.rejectWith(invalidPasswordError);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await component.copyPhrase();
    await fixture.whenStable();
    expect(clipboardServiceSpy.write).toHaveBeenCalledTimes(0);
    expect(toastServiceSpy.showInfoToast).toHaveBeenCalledTimes(0);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
    expect(component.buttonColor).toEqual('primary');
    expect(component.buttonFill).toEqual('outline');
  });

  it('should copy to clipboard, show toast and change button on Copy Button click if phrase was revealed', async () => {
    component.isRevealed = true;
    storageSpy.get.and.returnValue(Promise.resolve(true));
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await component.copyPhrase();
    await fixture.whenStable();
    expect(clipboardServiceSpy.write).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showInfoToast).toHaveBeenCalledTimes(1);
    expect(component.buttonColor).toEqual('secondary');
    expect(component.buttonFill).toEqual('solid');
  });

  it('should show error toast when password is incorrect', async () => {
    fakeModalController.modifyReturns({}, { data: 'testPass' });
    storageSpy.get.and.returnValue(Promise.resolve(true));
    walletEncryptionServiceSpy.getDecryptedERC20Wallet.and.rejectWith(invalidPasswordError);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await component.copyPhrase();
    await fixture.whenStable();
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
  });

  it('should show error toast when copy to clipboard fails', async () => {
    storageSpy.get.and.returnValue(Promise.resolve(true));
    clipboardServiceSpy.write.and.rejectWith();
    fakeModalController.modifyReturns({}, { data: 'testPass' });
    walletEncryptionServiceSpy.getDecryptedERC20Wallet.and.rejectWith(invalidPasswordError);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await component.copyPhrase();
    await fixture.whenStable();
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
  });

  it('should clear password and mnemonic on leave', async () => {
    const spyPassword = spyOn(component, 'clearPassword').and.callThrough();
    const spyMnemonic = spyOn(component, 'clearMnemonic').and.callThrough();
    component.ionViewWillLeave();
    expect(spyPassword).toHaveBeenCalledTimes(1);
    expect(spyMnemonic).toHaveBeenCalledTimes(1);
  });

  it('should clear password, mnemonic and hide phrase', () => {
    component.isRevealed = true;
    const spyPassword = spyOn(component, 'clearPassword').and.callThrough();
    const spyMnemonic = spyOn(component, 'clearMnemonic').and.callThrough();
    fixture.detectChanges();
    component.togglePhrase();
    expect(component.isRevealed).toBeFalse();
    expect(spyPassword).toHaveBeenCalledTimes(1);
    expect(spyMnemonic).toHaveBeenCalledTimes(1);
  });

  it('should show modal and call trackEvent on trackService when ux_protect_information clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'ux_protect_information');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not allow multiple info modals opening', () => {
    const infoButtonel = fixture.debugElement.query(By.css('div[name="ux_protect_information"]'))
    infoButtonel.nativeElement.click();
    infoButtonel.nativeElement.click();
    infoButtonel.nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
