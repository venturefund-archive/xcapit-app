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

const maticCoin: Coin = {
  id: 8,
  name: 'MATIC - Polygon',
  logoRoute: 'assets/img/coins/MATIC.png',
  value: 'MATIC',
  network: 'MATIC',
  native: true,
  symbol: 'MATICUSDT',
  last: false,
  chainId: 1,
  rpc: '',
};

const usdcCoin: Coin = {
  id: 2,
  name: 'USDC - Polygon',
  logoRoute: 'usdcLogo',
  value: 'USDC',
  network: 'MATIC',
  native: false,
  symbol: 'USDCUSDT',
  last: false,
  chainId: 1,
  rpc: '',
};

describe('SelectProviderCardComponent', () => {
  let component: SelectProviderCardComponent;
  let fixture: ComponentFixture<SelectProviderCardComponent>;
  let formGroupDirectiveMock: FormGroupDirective;
  let controlContainerMock: UntypedFormGroup;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;

  beforeEach(
    waitForAsync(() => {
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
              provider.currencies.some((curr) => curr.symbol === usdcCoin.value && curr.network === usdcCoin.network)
          )
        ),
      });

      providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
        create: providersSpy,
      });

      formGroupDirectiveMock = new FormGroupDirective([], []);
      formGroupDirectiveMock.form = controlContainerMock;

      TestBed.configureTestingModule({
        declarations: [SelectProviderCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
          { provide: ProvidersFactory, useValue: providersFactorySpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectProviderCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when radio button is checked', async() => {
    component.coin = usdcCoin;
    component.ngOnInit();
    fixture.detectChanges();
    component.form.patchValue({ country: 'Ecuador' });
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

  it('should filter providers by country and coin and show availables providers', async () => {
    component.coin = usdcCoin;
    component.ngOnInit();
    fixture.detectChanges();
    component.form.patchValue({ country: 'Ecuador' });
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const providerCards = fixture.debugElement.queryAll(By.css('app-provider-card'));
    expect(providerCards.length).toEqual(2);
    expect(component.disabled).toEqual(false);
  });

  it('should filter providers by country and coin and show non providers', async () => {
    component.coin = maticCoin;
    providersSpy.availablesBy.and.resolveTo(
      rawProvidersData.filter(
        (provider) =>
          provider.countries.includes('Ecuador') &&
          provider.currencies.some((curr) => curr.symbol === maticCoin.value && curr.network === maticCoin.network)
      )
    );
    component.ngOnInit();
    fixture.detectChanges();
    component.form.patchValue({ country: 'Ecuador' });
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const providerCards = fixture.debugElement.queryAll(By.css('app-provider-card'));
    const noProvidersEl = fixture.debugElement.query(By.css('div.spc__no_providers'));
    expect(providerCards.length).toEqual(0);
    expect(component.disabled).toBeFalsy();
    expect(noProvidersEl).toBeTruthy();
  });
});