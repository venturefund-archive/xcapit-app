import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, IonSlides, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { VerifyPhrasePage } from './verify-phrase.page';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { Mnemonic } from '@ethersproject/hdnode';

const words1 = ['insecto', 'puerta', 'vestido'];
const words2 = ['piso', 'plato', 'nube'];
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

  beforeEach(
    waitForAsync(() => {
      walletMnemonicServiceSpy = jasmine.createSpyObj(
        'WalletMnemonicService',
        {
          newMnemonic: () => testMnemonic,
        },
        { mnemonic: testMnemonic }
      );
      TestBed.configureTestingModule({
        declarations: [VerifyPhrasePage, TrackClickDirective],
        imports: [IonicModule, HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [
          TrackClickDirective,
          { provide: NavController, useValue: navControllerMock },
          { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(VerifyPhrasePage);
      component = fixture.componentInstance;
      component.words = ['test', 'words'];
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      navController = TestBed.inject(NavController);
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

  it('should push word in inputWord when wordValue is called', fakeAsync(() => {
    component.inputWords = [];
    spyOn(component.slides, 'slideNext');
    spyOn(component.slides, 'lockSwipeToNext').and.returnValue(null);
    spyOn(component.slides, 'lockSwipeToPrev').and.returnValue(null);
    fixture.detectChanges();
    component.wordValue('prueba');
    tick(850);
    expect(component.inputWords).toEqual(['prueba']);
  }));

  it('should call slideNext on wordValue is called', fakeAsync(() => {
    component.inputWords = [];
    const spySlideNext = spyOn(component.slides, 'slideNext');
    spyOn(component.slides, 'lockSwipeToNext').and.returnValue(null);
    spyOn(component.slides, 'lockSwipeToPrev').and.returnValue(null);
    component.wordValue('prueba');
    tick(850);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spySlideNext).toHaveBeenCalledTimes(1);
    });
  }));

  it('should activated is true when countWords and inputWords = 1', fakeAsync(() => {
    component.countWords = 1;
    component.inputWords = [];
    spyOn(component, 'swipeNext');
    component.wordValue('prueba');
    tick(850);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.activated).toBeTruthy();
    });
  }));

  it('should navigate to success when arrays equals', () => {
    component.inputWords = words1;
    component.words = words1;
    fixture.detectChanges();
    const spy = spyOn(navController, 'navigateForward');
    component.verifyPhrase();
    expect(spy).toHaveBeenCalledWith(['/wallets/success-creation']);
  });

  it('should not navigate to success when arrays different', () => {
    component.inputWords = words1;
    component.words = words2;
    fixture.detectChanges();
    const spy = spyOn(navController, 'navigateForward');
    component.verifyPhrase();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
