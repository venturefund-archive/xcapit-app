import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { QuotesService } from '../../services/quotes.service';
import { QuotesCardComponent } from './quotes-card.component';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { coins, firstNativeQuotes, remainingNativeQuotes, remainingUserQuotes, totalQuotes, usdcQuote, userQuotes } from '../../fixtures/quotes-card.fixture';

describe('QuotesCardComponent', () => {
  let component: QuotesCardComponent;
  let fixture: ComponentFixture<QuotesCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<QuotesCardComponent>;
  let quoteServiceSpy: jasmine.SpyObj<QuotesService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeWalletService: FakeWalletService;
  beforeEach(
    waitForAsync(() => {
      fakeWalletService = new FakeWalletService(true);
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getAssetsSelected: Promise.resolve(coins),
      });
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoins: coins,
      });
      quoteServiceSpy = jasmine.createSpyObj('QuotesService', {
        getAllQuotes: of(totalQuotes),
        getUsdcQuote: of(usdcQuote)
      });
      walletServiceSpy = fakeWalletService.createSpy();
      TestBed.configureTestingModule({
        declarations: [QuotesCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
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
    component.ngOnInit();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Close Accordion"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(component.openedAccordion).toBeFalse();
    expect(component.accordionGroup.value).toBeFalsy();
  });

  it('should filter native Quotes of complete Data when wallet dont exist', async () => {
    fakeWalletService.modifyReturns(false, {});
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.waitingQuotes).toBeFalse();
    expect(component.firstQuotes).toEqual(firstNativeQuotes);
    expect(component.remainingQuotes).toEqual(remainingNativeQuotes);
  });

  it('should filter user Quotes of complete Data when wallet exist', async () => {
    fakeWalletService.modifyReturns(true, {});
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.waitingQuotes).toBeFalse();
    expect(component.firstQuotes).toEqual(firstNativeQuotes);
    expect(component.remainingQuotes).toEqual(remainingUserQuotes);
  });

  it('should set usdc quote on init when usdc is part of list and have usdc-data', async () => {
    fakeWalletService.modifyReturns(true, {});
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.firstQuotes).toEqual(firstNativeQuotes);
    expect(component.remainingQuotes).toEqual(remainingUserQuotes);
  });

 it('should delete usdc quote on init when usdc is part of list and dont have usdc-data', fakeAsync( () => {
    quoteServiceSpy.getUsdcQuote.and.returnValue(of(undefined));
    fakeWalletService.modifyReturns(true, {});
    fixture.detectChanges();
    tick();
    expect(component.firstQuotes).toEqual(firstNativeQuotes);
  }));
});
