import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Mnemonic } from '@ethersproject/hdnode';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { RecoveryWalletPage } from './recovery-wallet.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

const formData = {
  valid: {
    phrase: 'rhythm heavy choose day question few genre sport dog daring item carbon',
  },
  invalid: {
    phrase: '',
  },
  moreThan12: {
    phrase: 'rhythm heavy choose day question few genre sport dog daring item cat carbon',
  },
  lessThan12: {
    phrase: 'heavy choose day question few genre sport dog daring item cat',
  },
};

const testMnemonic: Mnemonic = {
  locale: 'en',
  path: '',
  phrase: 'rhythm heavy choose day question few genre sport daring item cat carbon',
};
describe('RecoveryWalletPage', () => {
  let component: RecoveryWalletPage;
  let fixture: ComponentFixture<RecoveryWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RecoveryWalletPage>;
  let clipboardServiceMock: any;
  let navControllerSpy: any;
  let walletMnemonicServiceSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      clipboardServiceMock = {
        read: () => Promise.resolve({ value: 'phrase', type: 'text/plain' }),
      };
      walletMnemonicServiceSpy = jasmine.createSpyObj('WalletMnemonicService', {
        importMnemonic: () => testMnemonic,
      });
      TestBed.configureTestingModule({
        declarations: [RecoveryWalletPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          ReactiveFormsModule,
          TranslateService,
          { provide: ClipboardService, useValue: clipboardServiceMock },
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(RecoveryWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should paste phrase when paste button is clicked and type is text/plain', async () => {
    const pasteButtonEl = fixture.debugElement.query(By.css('ion-button[name="Paste Phrase"]'));
    pasteButtonEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value.phrase).toBe('phrase');
  });

  it('should not paste phrase when paste button is clicked and type is not text/plain', async () => {
    clipboardServiceMock.read = () => Promise.resolve({ type: 'other', value: 'phrase' });
    const pasteButton = fixture.debugElement.query(By.css('ion-button[name="Paste Phrase"]'));
    pasteButton.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value.phrase).toBe('');
  });

  it('form should be invalid when textarea is empty in handleSubmit', () => {
    spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.invalid);
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy();
  });

  it('form should be invalid when textarea has more than 12 words in handleSubmit', () => {
    spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.moreThan12);
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy();
  });

  it('form should be invalid when textarea has less than 12 words in handleSubmit', () => {
    spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.lessThan12);
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy();
  });

  it('form should be valid when textarea is not empty & the phrase has 12 words in handleSubmit', () => {
    spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    expect(component.form.valid).toBeTruthy();
  });

  it('should call trackEvent on trackService when Send Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_import_import');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should erase the spaces between words and leave only one', () => {
    component.form.value.phrase = '    test   phrase  ';
    component.eraseSpacesBetweenWords();
    component.form.patchValue(component.form.value.phrase);
    fixture.detectChanges();
    expect(component.validPhrase).toEqual('test phrase');
  });

  it('should call import mnemonic and navigate "([wallets/select-coins, import])" when form and phrase are valid', () => {
    component.form.patchValue(formData.valid);
    fixture.debugElement.query(By.css('ion-button[name="ux_import_import"]')).nativeElement.click();
    expect(walletMnemonicServiceSpy.importMnemonic).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/select-coins', 'import']);
  });

  it('should navigate "([wallets/recovery/error])" when form is valid and phrase not exist', () => {
    component.form.patchValue(formData.valid);
    walletMnemonicServiceSpy.importMnemonic = jasmine.createSpy().and.throwError('invalid mnemonic');
    fixture.debugElement.query(By.css('ion-button[name="ux_import_import"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/recovery/error']);
  });
});
