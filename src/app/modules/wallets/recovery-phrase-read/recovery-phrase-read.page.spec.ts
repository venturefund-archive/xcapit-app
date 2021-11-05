import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RecoveryPhraseReadPage } from './recovery-phrase-read.page';
import { Mnemonic } from '@ethersproject/hdnode';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.helper';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../../testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

const testMnemonic: Mnemonic = {
  path: '',
  locale: 'en',
  phrase: 'test recovery phrase',
};

describe('RecoveryPhraseReadPage', () => {
  let component: RecoveryPhraseReadPage;
  let fixture: ComponentFixture<RecoveryPhraseReadPage>;
  let walletMnemonicServiceSpy: jasmine.SpyObj<WalletMnemonicService>;
  let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RecoveryPhraseReadPage>;

  beforeEach(
    waitForAsync(() => {
      walletMnemonicServiceSpy = jasmine.createSpyObj('WalletMnemonicService', {}, { mnemonic: testMnemonic });
      clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', { write: Promise.resolve() });
      toastServiceSpy = jasmine.createSpyObj('ToastService', { showToast: Promise.resolve() });

      TestBed.configureTestingModule({
        declarations: [RecoveryPhraseReadPage, FakeTrackClickDirective],
        imports: [
          RouterTestingModule.withRoutes([{ path: 'wallets/recovery/info', component: DummyComponent }]),
          IonicModule.forRoot(),
          TranslateModule.forRoot(),
          HttpClientTestingModule,
        ],
        providers: [
          TranslateService,
          { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
          { provide: ClipboardService, useValue: clipboardServiceSpy },
          { provide: ToastService, useValue: toastServiceSpy },
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

  it('should show recovery phrase on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(component.mnemonic).toEqual(testMnemonic);
  });

  it('should copy to clipboard, show toast and change button on Copy Button click', async () => {
    component.ionViewWillEnter();
    fixture.debugElement.query(By.css('ion-button[name="Copy"]')).nativeElement.click();
    await fixture.whenStable();
    expect(clipboardServiceSpy.write).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showToast).toHaveBeenCalledTimes(1);
    expect(component.buttonColor).toEqual('uxsecondary');
    expect(component.buttonFill).toEqual('solid');
  });

  it('should show toast and not change button if error ocurred while copying on Copy Button click', async () => {
    component.ionViewWillEnter();
    clipboardServiceSpy.write.and.rejectWith({});
    fixture.debugElement.query(By.css('ion-button[name="Copy"]')).nativeElement.click();
    await fixture.whenStable();
    expect(clipboardServiceSpy.write).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showToast).toHaveBeenCalledTimes(1);
    expect(component.buttonColor).toEqual('uxprimary');
    expect(component.buttonFill).toEqual('outline');
  });

  it('should call trackEvent on trackService when Copy Button clicked', () => {
    component.ionViewWillEnter();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Copy');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
