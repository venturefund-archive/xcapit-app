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

const testMnemonic: Mnemonic = {
  path: '',
  locale: 'en',
  phrase: 'test recovery phrase',
};

describe('RecoveryPhraseReadPage', () => {
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

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      
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


      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
        getDecryptedWallet: Promise.resolve(jasmine.createSpyObj('Wallet', {},{ mnemonic: testMnemonic })),
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

  it('should navigate to verify phrase if Continue button was clicked', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_protect_continue_phrase"]'));
    buttonEl.nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/create-first/verify-phrase']);
  });

  it('should reveal phrase, copy to clipboard, show toast and change button on Copy Button click', async () => {
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
    storageSpy.get.and.returnValue(Promise.resolve(true));
    walletEncryptionServiceSpy.getDecryptedWallet.and.rejectWith();
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
});
