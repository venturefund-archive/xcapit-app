import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Mnemonic } from '@ethersproject/hdnode';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { RecoveryWalletPage } from './recovery-wallet.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

const formData = {
  valid: {
    phrase: 'rhythm heavy choose day question few genre sport dog daring item carbon',
  },
  empty: {
    phrase: '',
  },
  onlySpace: {
    phrase: ' ',
  },
  moreThan12: {
    phrase: 'rhythm heavy choose day question few genre sport dog daring item cat carbon',
  },
  lessThan12: {
    phrase: 'heavy choose day question few genre sport dog daring item cat',
  },
  allCaps: {
    phrase: 'HEAVY CHOOSE DAY QUESTION FEW GENRE SPORT DOG DARING ITEM CAT RHYTHM',
  },
  separatedByComma: {
    phrase: 'rhythm, heavy, choose, day, question, few, genre, sport, dog, daring, item, carbon',
  },
  separatedByHyphen: {
    phrase: 'rhythm-heavy-choose-day-question-few-genre-sport-dog-daring-item-carbon',
  },
  weirdCharacters: {
    phrase: 'rhythm heavy choose day question# few genre sport dog daring item carbon',
  },
  numbers: {
    phrase: 'rhythm heavy ch00se day question few genre sport dog daring item carbon',
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
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
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
          { provide: ModalController, useValue: modalControllerSpy },
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
    component.form.patchValue(formData.empty);
    fixture.detectChanges();
    expect(component.form.get('phrase').hasError('required')).toBeTrue();
    expect(component.form.get('phrase').hasError('twelveWords')).toBeTrue();
    expect(component.form.get('phrase').hasError('spaceBetween')).toBeTrue();
    expect(component.form.get('phrase').hasError('hasSpecialCharacter')).toBeFalse();
    expect(component.form.valid).toBeFalse();
  });

  it('form should be invalid when textarea has more than 12 words in handleSubmit', () => {
    spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.moreThan12);
    fixture.detectChanges();
    expect(component.form.get('phrase').hasError('required')).toBeFalse();
    expect(component.form.get('phrase').hasError('twelveWords')).toBeTrue();
    expect(component.form.get('phrase').hasError('spaceBetween')).toBeFalse();
    expect(component.form.get('phrase').hasError('hasSpecialCharacter')).toBeFalse();
    expect(component.form.valid).toBeFalse();
  });

  it('form should be invalid when textarea has less than 12 words in handleSubmit', () => {
    spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.lessThan12);
    fixture.detectChanges();
    expect(component.form.get('phrase').hasError('required')).toBeFalse();
    expect(component.form.get('phrase').hasError('twelveWords')).toBeTrue();
    expect(component.form.get('phrase').hasError('spaceBetween')).toBeFalse();
    expect(component.form.get('phrase').hasError('hasSpecialCharacter')).toBeFalse();
    expect(component.form.valid).toBeFalse();
  });

  it('form should be invalid when textarea has only spaces in handleSubmit', () => {
    spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.onlySpace);
    fixture.detectChanges();
    expect(component.form.get('phrase').hasError('required')).toBeFalse();
    expect(component.form.get('phrase').hasError('twelveWords')).toBeTrue();
    expect(component.form.get('phrase').hasError('spaceBetween')).toBeTrue();
    expect(component.form.get('phrase').hasError('hasSpecialCharacter')).toBeFalse();
    expect(component.form.valid).toBeFalse();
  });

  it('form should be invalid when textarea has phrase in all caps in handleSubmit', () => {
    spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.allCaps);
    fixture.detectChanges();
    expect(component.form.get('phrase').hasError('required')).toBeFalse();
    expect(component.form.get('phrase').hasError('twelveWords')).toBeTrue();
    expect(component.form.get('phrase').hasError('spaceBetween')).toBeFalse();
    expect(component.form.get('phrase').hasError('hasSpecialCharacter')).toBeFalse();
    expect(component.form.valid).toBeFalse();
  });

  it('form should be invalid when textarea has numbers in handleSubmit', () => {
    spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.numbers);
    fixture.detectChanges();
    expect(component.form.get('phrase').hasError('required')).toBeFalse();
    expect(component.form.get('phrase').hasError('twelveWords')).toBeFalse();
    expect(component.form.get('phrase').hasError('spaceBetween')).toBeFalse();
    expect(component.form.get('phrase').hasError('hasSpecialCharacter')).toBeTrue();
    expect(component.form.valid).toBeFalse();
  });

  it('form should be invalid when textarea has weird characters in handleSubmit', () => {
    spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.weirdCharacters);
    fixture.detectChanges();
    expect(component.form.get('phrase').hasError('required')).toBeFalse();
    expect(component.form.get('phrase').hasError('twelveWords')).toBeFalse();
    expect(component.form.get('phrase').hasError('spaceBetween')).toBeTrue();
    expect(component.form.get('phrase').hasError('hasSpecialCharacter')).toBeTrue();
    expect(component.form.valid).toBeFalse();
  });

  it('form should be invalid when phrase is separated by commas in handleSubmit', () => {
    spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.separatedByComma);
    fixture.detectChanges();
    expect(component.form.get('phrase').hasError('required')).toBeFalse();
    expect(component.form.get('phrase').hasError('twelveWords')).toBeFalse();
    expect(component.form.get('phrase').hasError('spaceBetween')).toBeTrue();
    expect(component.form.get('phrase').hasError('hasSpecialCharacter')).toBeTrue();
    expect(component.form.valid).toBeFalse();
  });

  it('form should be invalid when phrase is separated by hyphens in handleSubmit', () => {
    spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.separatedByHyphen);
    fixture.detectChanges();
    expect(component.form.get('phrase').hasError('required')).toBeFalse();
    expect(component.form.get('phrase').hasError('twelveWords')).toBeFalse();
    expect(component.form.get('phrase').hasError('spaceBetween')).toBeTrue();
    expect(component.form.get('phrase').hasError('hasSpecialCharacter')).toBeTrue();
    expect(component.form.valid).toBeFalse();
  });

  it('form should be valid when textarea is not empty & the phrase has 12 words in handleSubmit', () => {
    spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    expect(component.form.get('phrase').hasError('required')).toBeFalse();
    expect(component.form.get('phrase').hasError('twelveWords')).toBeFalse();
    expect(component.form.get('phrase').hasError('spaceBetween')).toBeFalse();
    expect(component.form.get('phrase').hasError('hasSpecialCharacter')).toBeFalse();
    expect(component.form.valid).toBeTrue();
  });

  it('should call trackEvent on trackService when ux_import_submit_phrase clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_import_submit_phrase');
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

  it('should call import mnemonic and navigate "([wallets/create-password, import])" when form and phrase are valid', () => {
    component.form.patchValue(formData.valid);
    fixture.debugElement.query(By.css('ion-button[name="ux_import_submit_phrase"]')).nativeElement.click();
    expect(walletMnemonicServiceSpy.importMnemonic).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/create-password', 'import']);
  });

  it('should navigate "([wallets/recovery/error])" when form is valid and phrase not exist', () => {
    component.form.patchValue(formData.valid);
    walletMnemonicServiceSpy.importMnemonic = jasmine.createSpy().and.throwError('invalid mnemonic');
    fixture.debugElement.query(By.css('ion-button[name="ux_import_submit_phrase"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/recovery/error']);
  });

  it('should show modal and call trackEvent on trackService when ux_phrase_information clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_phrase_information');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not allow multiple phrase info modals opening', () => {
    const infoButtonel = fixture.debugElement.query(By.css('ion-button[name="ux_phrase_information"]'))
    infoButtonel.nativeElement.click();
    infoButtonel.nativeElement.click();
    infoButtonel.nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
