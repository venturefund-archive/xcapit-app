import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { Quotes } from '../../interfaces/quotes.interface';
import { QuotesService } from '../../services/quotes.service';
import { QuotesCardComponent } from './quotes-card.component';

const totalQuotes: Quotes[] = [
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
    symbol: 'MATICUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'BNBUSDT',
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

//Native
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
  {
    symbol: 'MATICUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'BNBUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
];

const firstNativeQuotes = [
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
    symbol: 'MATICUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
];

const remainingNativeQuotes = [
  {
    symbol: 'BNBUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
];

//

//User Quotes

const userQuotes = [
  {
    symbol: 'BNBUSDT',
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

const firstUserQuotes = [
  {
    symbol: 'BNBUSDT',
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
];

const remainingUserQuotes = [
  {
    symbol: 'SOVUSDT',
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
];

// const testUserCoins = [
//   {
//     id: 4,
//     name: 'AAVE',
//     logoRoute: 'assets/img/coins/AAVE.svg',
//     last: false,
//     value: 'AAVE',
//     network: 'ERC20',
//     chainId: 42,
//     contract: '0xb597cd8d3217ea6477232f9217fa70837ff667af',
//     decimals: 18,
//     symbol: 'AAVEUSDT',
//   },
//   {
//     id: 5,
//     name: 'UNI - Uniswap',
//     logoRoute: 'assets/img/coins/UNI.svg',
//     last: true,
//     value: 'UNI',
//     network: 'ERC20',
//     chainId: 42,
//     decimals: 18,
//     symbol: 'UNIUSDT',
//   },
// ];

describe('QuotesCardComponent', () => {
  let component: QuotesCardComponent;
  let fixture: ComponentFixture<QuotesCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<QuotesCardComponent>;
  let quoteServiceSpy: jasmine.SpyObj<QuotesService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  beforeEach(
    waitForAsync(() => {
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getAssestsSelected: Promise.resolve(userQuotes),
      });
      quoteServiceSpy = jasmine.createSpyObj('QuotesService', {
        getAllQuotes: of(totalQuotes),
      });
      walletServiceSpy = jasmine.createSpyObj('WalletService', { walletExist: Promise.resolve() });
      TestBed.configureTestingModule({
        declarations: [QuotesCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: QuotesService, useValue: quoteServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(QuotesCardComponent);
      component = fixture.componentInstance;
      component.waitingQuotes = true;
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

  it('should filter native Quotes of complete Data when wallet dont exist', async () => {
    walletServiceSpy.walletExist.and.returnValue(Promise.resolve(false));
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.waitingQuotes).toBeFalse();
    expect(component.firstQuotes).toEqual(firstNativeQuotes);
    expect(component.remainingQuotes).toEqual(remainingNativeQuotes);
    expect(walletServiceSpy.walletExist).toHaveBeenCalledTimes(1);
  });

  it('should filter user Quotes of complete Data when wallet dont exist', async () => {
    walletServiceSpy.walletExist.and.returnValue(Promise.resolve(true));
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.waitingQuotes).toBeFalse();
    expect(component.firstQuotes).toEqual(firstUserQuotes);
    expect(component.remainingQuotes).toEqual(remainingUserQuotes);
  });
});
