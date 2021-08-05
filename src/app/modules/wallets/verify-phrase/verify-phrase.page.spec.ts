import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { VerifyPhrasePage } from './verify-phrase.page';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { Mnemonic } from '@ethersproject/hdnode';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';

const phrase = ['insecto', 'puerta', 'vestido'];
const phrase2 = ['piso', 'plato', 'nube'];
const testMnemonic: Mnemonic = {
  locale: 'en',
  path: '',
  phrase: 'test mnemonic phrase',
};

describe('VerifyPhrasePage', () => {
  let component: VerifyPhrasePage;
  let fixture: ComponentFixture<VerifyPhrasePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<VerifyPhrasePage>;
  let navController: NavController;
  let walletMnemonicServiceSpy;
  let walletServiceMock;
  let walletService: WalletService;

  beforeEach(
    waitForAsync(() => {
      walletMnemonicServiceSpy = jasmine.createSpyObj(
        'WalletMnemonicService',
        {
          newMnemonic: () => testMnemonic,
        },
        { mnemonic: testMnemonic }
      );
      walletServiceMock = {
        create: () => {},
      };
      TestBed.configureTestingModule({
        declarations: [VerifyPhrasePage, TrackClickDirective],
        imports: [IonicModule, HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [
          TrackClickDirective,
          { provide: NavController, useValue: navControllerMock },
          { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
          { provide: WalletService, useValue: walletServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(VerifyPhrasePage);
      component = fixture.componentInstance;
      component.phrase = ['test', 'phrase'];
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      navController = TestBed.inject(NavController);
      walletService = TestBed.inject(WalletService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Create Wallet clicked', () => {
    component.countWords = 12;
    component.activated = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Create Wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should block slide on ionViewWillEnter', () => {
    const spyBlockNext = spyOn(component.slides, 'lockSwipeToNext');
    const spyBlockPrev = spyOn(component.slides, 'lockSwipeToPrev');
    component.ionViewWillEnter();
    expect(spyBlockNext).toHaveBeenCalledTimes(1);
    expect(spyBlockPrev).toHaveBeenCalledTimes(1);
  });

  it('should get mnemonic from walletMnemonicService on ionViewWillEnter', () => {
    spyOn(component.slides, 'lockSwipeToNext');
    spyOn(component.slides, 'lockSwipeToPrev');
    component.ionViewWillEnter();
    expect(component.mnemonic).toEqual(testMnemonic);
  });

  it('should push word in inputWord when addWord is called', fakeAsync(() => {
    component.verificationPhrase = [];
    spyOn(component.slides, 'slideNext');
    spyOn(component.slides, 'lockSwipeToNext').and.returnValue(null);
    spyOn(component.slides, 'lockSwipeToPrev').and.returnValue(null);
    fixture.detectChanges();
    component.addWord('prueba');
    tick(850);
    expect(component.verificationPhrase).toEqual(['prueba']);
  }));

  it('should call slideNext on addWord is called', fakeAsync(() => {
    component.verificationPhrase = [];
    const spySlideNext = spyOn(component.slides, 'slideNext');
    spyOn(component.slides, 'lockSwipeToNext').and.returnValue(null);
    spyOn(component.slides, 'lockSwipeToPrev').and.returnValue(null);
    component.addWord('prueba');
    tick(850);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spySlideNext).toHaveBeenCalledTimes(1);
    });
  }));

  it('should activated is true when countWords and verificationPhrase = 1', fakeAsync(() => {
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

  it('should navigate to success when arrays equals', () => {
    component.verificationPhrase = phrase;
    component.phrase = phrase;
    fixture.detectChanges();
    const spy = spyOn(navController, 'navigateForward');
    component.createWallet();
    expect(spy).toHaveBeenCalledWith(['/wallets/success-creation']);
  });

  it('should not navigate to success when arrays different', () => {
    component.verificationPhrase = phrase;
    component.phrase = phrase2;
    fixture.detectChanges();
    const spy = spyOn(navController, 'navigateForward');
    component.createWallet();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should not navigate to success page on createWallet if phrase is incorrect', () => {
    component.verificationPhrase = phrase;
    component.phrase = phrase2;
    fixture.detectChanges();
    const spy = spyOn(navController, 'navigateForward');
    component.createWallet();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should create wallet on createWallet if arrays are equal', () => {
    component.verificationPhrase = phrase;
    component.phrase = phrase;
    fixture.detectChanges();
    const spy = spyOn(walletService, 'create');
    component.createWallet();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not create wallet on createWallet if arrays are different', () => {
    component.verificationPhrase = phrase;
    component.phrase = phrase2;
    fixture.detectChanges();
    const spy = spyOn(walletService, 'create');
    component.createWallet();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
