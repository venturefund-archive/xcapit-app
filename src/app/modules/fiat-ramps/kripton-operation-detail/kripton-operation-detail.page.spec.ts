import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TEST_COINS } from '../../wallets/shared-wallets/constants/coins.test';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { FakeProviders } from '../shared-ramps/models/providers/fake/fake-providers';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonOperationDetailPage } from './kripton-operation-detail.page';

describe('KriptonOperationDetailPage', () => {
  let component: KriptonOperationDetailPage;
  let fixture: ComponentFixture<KriptonOperationDetailPage>;
  let fakeRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let fakeProviders: FakeProviders;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  const operation: FiatRampOperation = {
    operation_id: 678,
    operation_type: 'cash-in',
    status: 'cancel',
    currency_in: 'ARS',
    amount_in: 500.0,
    currency_out: 'ETH',
    amount_out: 100.0,
    created_at: new Date('2021-02-27T10:02:49.719Z'),
    provider: '1',
    voucher: false,
    wallet_address: '0xeeeeeeeee',
  };

  beforeEach(waitForAsync(() => {
    fakeRoute = new FakeActivatedRoute();
    activatedRouteSpy = fakeRoute.createSpy();
    fakeRoute.modifySnapshotParams('1');
    fakeProviders = new FakeProviders(
      rawProvidersData,
      rawProvidersData.find((provider) => provider.alias === 'kripton'),
      null,
      of([
        {
          code: 'PX',
          paymentType: 'VOUCHER',
        },
      ])
    );

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: fakeProviders,
    });

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoin: TEST_COINS[0],
    });

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      setProvider: null,
      getUserSingleOperation: of([operation]),
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    TestBed.configureTestingModule({
      declarations: [KriptonOperationDetailPage, FakeTrackClickDirective, FormattedAmountPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KriptonOperationDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show selected provider on init', () => {
    const spy = spyOn(FakeProviders.prototype, 'byAlias').and.returnValue(rawProvidersData.find((provider) => provider.alias === 'kripton'));
    component.ionViewWillEnter();

    expect(spy).toHaveBeenCalledOnceWith('kripton');
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should show operation details on init', async () => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const currency = fixture.debugElement.query(By.css('.kod__card-container__card__coin__content__name > ion-text'))
      .nativeElement.innerText;
    const amount = fixture.debugElement.query(By.css('.kod__card-container__card__amount__out > ion-text'))
      .nativeElement.innerText;
    const fiatAmount = fixture.debugElement.query(By.css('.kod__card-container__card__amount__in > ion-text'))
      .nativeElement.innerText;
    const state = fixture.debugElement.query(By.css('app-operation-status-chip'));
    const toast = fixture.debugElement.query(By.css('app-operation-status-alert'));
    const quotations = fixture.debugElement.query(
      By.css('.kod__card-container__card__quotation__container__content > ion-text')
    ).nativeElement.innerText;
    const address = fixture.debugElement.query(
      By.css('.kod__card-container__card__address__container__content > ion-text')
    ).nativeElement.innerText;
    const operationNumber = fixture.debugElement.query(
      By.css('.kod__card-container__card__provider__container__operation__content > ion-text')
    ).nativeElement.innerText;
    const date = fixture.debugElement.query(
      By.css('.kod__card-container__card__date__container__date__content > ion-text')
    ).nativeElement.innerText;
    const hour = fixture.debugElement.query(
      By.css('.kod__card-container__card__date__container__hour__content > ion-text')
    ).nativeElement.innerText;
    expect(currency).toContain(operation.currency_out);
    expect(amount).toContain(operation.amount_out);
    expect(fiatAmount).toContain(operation.amount_in);
    expect(state).toBeTruthy();
    expect(toast).toBeTruthy();
    expect(quotations).toContain('1 ETH = 5.00 ARS');
    expect(address).toContain(operation.wallet_address);
    expect(operationNumber).toContain(operation.operation_id);
    expect(date).toContain('27/02/2021');
    expect(hour).toMatch(/\d\d:\d\d/g);
  });

  it('should redirect to Kripton Support when user clicks ux_goto_kripton_tos button', () => {
    const url = {
      url: 'https://kriptonmarket.com/terms-and-conditions',
    };
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_goto_kripton_tos"]')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith(url);
  });

  it('should navigate back to operations if operation does not exist', async () => {
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(throwError('error'));
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/fiat-ramps/purchases']);
  });
});
