import { HttpClientTestingModule } from '@angular/common/http/testing';
import { componentFactoryName } from '@angular/compiler';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { QuotesService } from '../../services/quotes.service';
import { QuotesCardComponent } from './quotes-card.component';

const totalQuotes = [
  {
    symbol: 'BTCUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'ETHUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'AAVEUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'UNIUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'SOVUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
];

const firstQuotes = [
  {
    symbol: 'BTCUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'ETHUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'AAVEUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
];

const remainingQuotes = [
  {
    symbol: 'UNIUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'SOVUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
];

const nativeQuotes = [
  {
    symbol: 'BTCUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'ETHUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
];

const userCoinsQuotes = [
  {
    symbol: 'AAVEUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'UNIUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
];

const testUserCoins = [
  {
    id: 4,
    name: 'AAVE',
    logoRoute: 'assets/img/coins/AAVE.svg',
    last: false,
    value: 'AAVE',
    network: 'ERC20',
    chainId: 42,
    contract: '0xb597cd8d3217ea6477232f9217fa70837ff667af',
    decimals: 18,
    symbol: 'AAVEUSDT',
  },
  {
    id: 5,
    name: 'UNI - Uniswap',
    logoRoute: 'assets/img/coins/UNI.svg',
    last: true,
    value: 'UNI',
    network: 'ERC20',
    chainId: 42,
    decimals: 18,
    symbol: 'UNIUSDT',
  },
];

describe('QuotesCardComponent', () => {
  let component: QuotesCardComponent;
  let fixture: ComponentFixture<QuotesCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<QuotesCardComponent>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  beforeEach(
    waitForAsync(() => {
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getAssestsSelected: Promise.resolve(testUserCoins),
      });
      walletServiceSpy = jasmine.createSpyObj('WalletService', { walletExist: Promise.resolve(true) });
      TestBed.configureTestingModule({
        declarations: [QuotesCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: StorageService, useValue: storageServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(QuotesCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Open Accordion button is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Open Accordion');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Close Accordion button is clicked', () => {
    component.openedAccordion = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close Accordion');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should expand accordion when Open Accordion button is clicked', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Open Accordion"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(component.openedAccordion).toBeTrue();
    expect(component.accordionGroup.value).toBe('quotes');
  });

  it('should collapse accordion when Close Accordion button is clicked', () => {
    component.accordionGroup.value = 'quotes';
    component.openedAccordion = true;
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Close Accordion"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(component.openedAccordion).toBeFalse();
    expect(component.accordionGroup.value).toBeFalsy();
  });

  it('should expand accordion when Open Accordion button is clicked', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Open Accordion"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(component.openedAccordion).toBeTrue();
    expect(component.accordionGroup.value).toBe('quotes');
  });

  it('should call walletExist on walletService', () => {
    component.existWallet();
    fixture.detectChanges();
    expect(walletServiceSpy.walletExist).toHaveBeenCalledTimes(1);
  });

  it('should call getUserCoinsQuotes when wallet exist', async () => {
    const spy = spyOn(component, 'getUserCoinsQuotes');
    component.existWallet();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getNativeQuotes when wallet dont exist', async () => {
    const spy = spyOn(component, 'getNativeQuotes');
    walletServiceSpy.walletExist.and.resolveTo(false);
    component.existWallet();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should slice all quotes in two parts', async () => {
    component.separateFilteredData(totalQuotes);
    fixture.detectChanges();
    expect(component.firstQuotes).toEqual(firstQuotes);
    expect(component.remainingQuotes).toEqual(remainingQuotes);
  });

  it('should filter native Coins of complete Data when wallet dont exist', async () => {
    component.completeData = totalQuotes;
    const spy = spyOn(component, 'separateFilteredData');
    component.waitingQuotes = true;
    component.walletExist = false;
    component.getNativeQuotes();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(nativeQuotes);
    expect(component.waitingQuotes).toBeFalse();
  });

  it('should filter user Coins of complete Data when wallet exist', async () => {
    component.completeData = totalQuotes;
    const spy = spyOn(component, 'separateFilteredData');
    component.waitingQuotes = true;
    component.walletExist = true;
    storageServiceSpy.getAssestsSelected();
    component.getUserCoinsQuotes();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(spy).toHaveBeenCalledWith(userCoinsQuotes);
    expect(component.waitingQuotes).toBeFalse();
  });
});
