import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, IonSlides, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { VerifyPhrasePage } from './verify-phrase.page';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { Mnemonic } from '@ethersproject/hdnode';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { RecoveryPhraseCardComponent } from '../shared-wallets/components/recovery-phrase-card/recovery-phrase-card.component';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { IonSlidesMock } from 'src/testing/spies/ion-slides-mock.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

const phrase = ['insecto', 'puerta', 'vestido'];
const phrase_1 = [
  'test',
  'phrase',
  'other',
  'word',
  'number',
  'another',
  'rooster',
  'keyboard',
  'confort',
  'destroy',
  'jingle',
  'july',
];
const phrase2 = ['piso', 'plato', 'nube'];
const testMnemonic: Mnemonic = {
  locale: 'en',
  path: '',
  phrase: 'test phrase other word number another rooster keyboard confort destroy jingle july',
};

describe('VerifyPhrasePage', () => {
  let component: VerifyPhrasePage;
  let fixture: ComponentFixture<VerifyPhrasePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<VerifyPhrasePage>;
  let walletMnemonicServiceSpy;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      walletMnemonicServiceSpy = jasmine.createSpyObj(
        'WalletMnemonicService',
        {
          newMnemonic: () => testMnemonic,
        },
        { mnemonic: testMnemonic }
      );
      walletServiceSpy = jasmine.createSpyObj('WalletService', { create: Promise.resolve({}) });
      TestBed.configureTestingModule({
        declarations: [VerifyPhrasePage, FakeTrackClickDirective, RecoveryPhraseCardComponent],
        imports: [IonicModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: IonSlides, useValue: IonSlidesMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(VerifyPhrasePage);
      component = fixture.componentInstance;
      component.phrase = phrase_1;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when ux_create_verify_wallet clicked', () => {
    component.countWords = 12;
    component.activated = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_create_verify_wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get mnemonic from walletMnemonicService on ionViewWillEnter', () => {
    spyOn(component.slides, 'lockSwipeToNext');
    spyOn(component.slides, 'lockSwipeToPrev');
    component.ionViewWillEnter();
    expect(component.mnemonic).toEqual(testMnemonic);
    expect(component.countWords).toEqual(12);
  });

  it('should block slide on ionViewWillEnter', () => {
    const spyBlockNext = spyOn(component.slides, 'lockSwipeToNext');
    const spyBlockPrev = spyOn(component.slides, 'lockSwipeToPrev');
    component.ionViewWillEnter();
    expect(spyBlockNext).toHaveBeenCalledTimes(1);
    expect(spyBlockPrev).toHaveBeenCalledTimes(1);
  });

  it('should push word in verificationPhrase when addWord is called', () => {
    component.verificationPhrase = [];
    spyOn(component.slides, 'slideNext');
    spyOn(component.slides, 'lockSwipeToNext').and.returnValue(null);
    spyOn(component.slides, 'lockSwipeToPrev').and.returnValue(null);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-recovery-phrase-card')).triggerEventHandler('useButtonClicked', 'test');
    expect(component.verificationPhrase).toEqual(['test']);
  });

  it('should call slideNext when a word is added', async () => {
    component.verificationPhrase = [];
    component.slide = 2;
    const spySlideNext = spyOn(component.slides, 'slideNext');
    spyOn(component.slides, 'lockSwipeToNext').and.returnValue(null);
    spyOn(component.slides, 'lockSwipeToPrev').and.returnValue(null);
    fixture.debugElement.query(By.css('app-recovery-phrase-card')).triggerEventHandler('useButtonClicked', 'test');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spySlideNext).toHaveBeenCalledTimes(1);
  });

  it('should render ux_create_verify_wallet button when all words are entered', fakeAsync(() => {
    component.countWords = 1;
    component.verificationPhrase = [];
    spyOn(component, 'swipeNext');
    component.addWord('prueba');
    tick(850);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.activated).toBeTruthy();
    });
  }));

  it('should create wallet and navigate to create password when ux_create_verify_wallet button is clicked and the phrases match', async () => {
    component.verificationPhrase = phrase;
    component.phrase = phrase;
    component.activated = true;
    fixture.detectChanges();
    fixture.debugElement.query(By.css("ion-button[name='ux_create_verify_wallet']")).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/create-password']);
    expect(walletServiceSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not create wallet on createWallet if arrays are different', () => {
    component.verificationPhrase = phrase;
    component.phrase = phrase2;
    component.activated = true;
    fixture.detectChanges();
    fixture.debugElement.query(By.css("ion-button[name='ux_create_verify_wallet']")).nativeElement.click();
    expect(walletServiceSpy.create).toHaveBeenCalledTimes(0);
  });

  it('should redirect to failed mnemonic page when verification phrase is wrong', async () => {
    component.activated = true;
    component.verificationPhrase = phrase;
    component.phrase = phrase2;
    fixture.detectChanges();
    await fixture.whenStable();
    const createWalletButton = fixture.debugElement.query(By.css("ion-button[name='ux_create_verify_wallet']"));
    createWalletButton.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/failed-mnemonic']);
  });

  it('should not show button of the slide that is on the right than last word added', async () => {
    ['duck', 'chicken', 'cow'].forEach((word) => {
      fixture.debugElement.query(By.css('app-recovery-phrase-card')).triggerEventHandler('useButtonClicked', word);
    });
    fixture.detectChanges();
    const slideRightToFilledSlide = fixture.debugElement.query(By.css('ion-button.input-word[id="3"]'));
    expect(slideRightToFilledSlide).toBeNull();
  });

  it('shouldnt erase word if the slide clicked is on the left than last word added', async () => {
    ['duck', 'chicken', 'cow'].forEach((word) => {
      fixture.debugElement.query(By.css('app-recovery-phrase-card')).triggerEventHandler('useButtonClicked', word);
    });
    fixture.detectChanges();
    const slideLeftToLastFilledSlide = fixture.debugElement.query(By.css('ion-button.input-word[id="1"]'));
    slideLeftToLastFilledSlide.nativeElement.click();

    expect(component.verificationPhrase).toEqual(['duck', 'chicken', 'cow']);
  });

  it('should erase word and enable it in the box of words if the slide clicked the last word added', async () => {
    const spy = spyOn(component.recoveryPhraseComponent, 'enable');
    ['duck', 'chicken', 'cow'].forEach((word) => {
      fixture.debugElement.query(By.css('app-recovery-phrase-card')).triggerEventHandler('useButtonClicked', word);
    });
    fixture.detectChanges();
    const slideLeftToLastFilledSlide = fixture.debugElement.query(By.css('ion-button.input-word[id="2"]'));
    slideLeftToLastFilledSlide.nativeElement.click();

    expect(component.verificationPhrase).toEqual(['duck', 'chicken']);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
