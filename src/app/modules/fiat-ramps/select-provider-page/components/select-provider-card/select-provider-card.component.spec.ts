import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProvidersFactory } from '../../../shared-ramps/models/providers/factory/providers.factory';
import { SelectProviderCardComponent } from './select-provider-card.component';
import { rawProvidersData } from '../../../shared-ramps/fixtures/raw-providers-data';
import { Providers } from '../../../shared-ramps/models/providers/providers.interface';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { DefaultMoonpayPriceFactory } from '../../../shared-ramps/models/moonpay-price/factory/default-moonpay-price-factory';
import { DefaultMoonpayPrice } from '../../../shared-ramps/models/moonpay-price/default-moonpay-price';
import { of } from 'rxjs';
import { FiatRampsService } from '../../../shared-ramps/services/fiat-ramps.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DefaultDirectaPriceFactory } from '../../../shared-ramps/models/directa-price/factory/default-directa-price-factory';
import { DefaultDirectaPrice } from '../../../shared-ramps/models/directa-price/default-directa-price';
import { DefaultKriptonPriceFactory } from '../../../shared-ramps/models/kripton-price/factory/default-kripton-price-factory';
import { DefaultKriptonPrice } from '../../../shared-ramps/models/kripton-price/default-kripton-price';
import { rawProviderCountriesData } from '../../../shared-ramps/fixtures/raw-provider-countries-data';

describe('SelectProviderCardComponent', () => {
  let component: SelectProviderCardComponent;
  let fixture: ComponentFixture<SelectProviderCardComponent>;
  let formGroupDirectiveMock: FormGroupDirective;
  let controlContainerMock: UntypedFormGroup;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let maticCoinSpy: jasmine.SpyObj<Coin>;
  let usdcCoinSpy: jasmine.SpyObj<Coin>;
  let moonpayPriceFactorySpy: jasmine.SpyObj<DefaultMoonpayPriceFactory>;
  let moonpayPrice: jasmine.SpyObj<DefaultMoonpayPrice>;
  let directaPriceFactorySpy: jasmine.SpyObj<DefaultDirectaPriceFactory>;
  let directaPrice: jasmine.SpyObj<DefaultDirectaPrice>;
  let kriptonPriceFactorySpy: jasmine.SpyObj<DefaultKriptonPriceFactory>;
  let kriptonPrice: jasmine.SpyObj<DefaultKriptonPrice>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;

  beforeEach(waitForAsync(() => {
    maticCoinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' });
    usdcCoinSpy = jasmine.createSpyObj('Coin', {}, { value: 'USDC', network: 'MATIC' });

    controlContainerMock = new UntypedFormBuilder().group({
      country: ['', []],
      provider: ['', []],
    });

    providersSpy = jasmine.createSpyObj('Providers', {
      all: rawProvidersData,
      availablesBy: Promise.resolve(
        rawProvidersData.filter(
          (provider) =>
            provider.countries.includes('Ecuador') &&
            provider.currencies.some(
              (curr) => curr.symbol === usdcCoinSpy.value && curr.network === usdcCoinSpy.network
            )
        )
      ),
    });

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getMoonpayBuyQuote: of({ quoteCurrencyPrice: 1 }),
    });

    moonpayPrice = jasmine.createSpyObj('DefaultMoonpayPrice', { value: of(3) });
    moonpayPriceFactorySpy = jasmine.createSpyObj('DefaultMoonpayPriceFactory', { new: moonpayPrice });

    directaPrice = jasmine.createSpyObj('DefaultDirectaPrice', { value: of(1) });
    directaPriceFactorySpy = jasmine.createSpyObj('DefaultDirectaPriceFactory', { new: directaPrice });

    kriptonPrice = jasmine.createSpyObj('DefaultKriptonPrice', { value: of(2) });
    kriptonPriceFactorySpy = jasmine.createSpyObj('DefaultKriptonPriceFactory', { new: kriptonPrice });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: providersSpy,
    });

    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;

    TestBed.configureTestingModule({
      declarations: [SelectProviderCardComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: DefaultMoonpayPriceFactory, useValue: moonpayPriceFactorySpy },
        { provide: DefaultKriptonPriceFactory, useValue: kriptonPriceFactorySpy },
        { provide: DefaultDirectaPriceFactory, useValue: directaPriceFactorySpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectProviderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when radio button is checked', async () => {
    component.coin = usdcCoinSpy;
    component.ngOnInit();
    fixture.detectChanges();
    component.form.patchValue({ country: rawProviderCountriesData[4] });
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const spy = spyOn(component.route, 'emit');
    fixture.debugElement.query(By.css('app-provider-card')).triggerEventHandler('selectedProvider', 'test');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show nothing if is disabled and there is not a country selected', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const providersEl = fixture.debugElement.query(By.css('div.spc__select__label-provider'));
    const noProvidersEl = fixture.debugElement.query(By.css('div.spc__no_providers'));
    expect(component.disabled).toBeTruthy();
    expect(providersEl).toBeNull();
    expect(noProvidersEl).toBeNull();
  });

  it('should filter providers by country and coin and show availables providers excluding moonpay to usd providers', async () => {
    component.coin = usdcCoinSpy;
    component.form.patchValue({ country: rawProviderCountriesData[4] });
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const providerCards = fixture.debugElement.queryAll(By.css('app-provider-card'));
    expect(providerCards.length).toEqual(3);
    expect(component.disabled).toEqual(false);
  });

  it('should filter providers by country and coin and show availables providers including moonpay on fiat providers', async () => {
    component.coin = usdcCoinSpy;
    providersSpy.availablesBy.and.resolveTo(
      rawProvidersData.filter(
        (provider) =>
          provider.countries.includes('Estados Unidos') &&
          provider.currencies.some((curr) => curr.symbol === usdcCoinSpy.value && curr.network === usdcCoinSpy.network)
      )
    );
    component.form.patchValue({ country: rawProviderCountriesData[6] });
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const providerCards = fixture.debugElement.queryAll(By.css('app-provider-card'));
    expect(providerCards.length).toEqual(1);
    expect(component.disabled).toEqual(false);
  });

  it('should filter providers by country and coin, show availables providers and select best provider', async () => {
    component.coin = usdcCoinSpy;
    providersSpy.availablesBy.and.resolveTo(
      rawProvidersData.filter(
        (provider) =>
          provider.countries.includes('Colombia') &&
          provider.currencies.some((curr) => curr.symbol === usdcCoinSpy.value && curr.network === usdcCoinSpy.network)
      )
    );

    component.form.patchValue({ country: rawProviderCountriesData[5] });
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();

    expect(component.form.controls.provider).not.toBeNull();
  });

  it('should filter providers by country and coin and show non providers', async () => {
    component.coin = maticCoinSpy;
    providersSpy.availablesBy.and.resolveTo(
      rawProvidersData.filter(
        (provider) =>
          provider.countries.includes('Ecuador') &&
          provider.currencies.some(
            (curr) => curr.symbol === maticCoinSpy.value && curr.network === maticCoinSpy.network
          )
      )
    );
    component.ngOnInit();
    fixture.detectChanges();
    component.form.patchValue({ country: rawProviderCountriesData[4] });
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const providerCards = fixture.debugElement.queryAll(By.css('app-provider-card'));
    const noProvidersEl = fixture.debugElement.query(By.css('div.spc__no_providers'));
    expect(providerCards.length).toEqual(0);
    expect(component.disabled).toBeFalsy();
    expect(noProvidersEl).toBeTruthy();
  });
});
