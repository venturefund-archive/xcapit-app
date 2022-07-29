import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { DirectaPage } from './directa.page';
import { rawProviderCountriesData } from '../shared-ramps/fixtures/raw-provider-countries-data';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { WalletMaintenanceService } from '../../wallets/shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DirectaPage', () => {
  let component: DirectaPage;
  let fixture: ComponentFixture<DirectaPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let coinsSpy: jasmine.SpyObj<Coin>[];
  let fakeActivatedRoute: FakeActivatedRoute;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let walletMaintenanceServiceSpy: jasmine.SpyObj<WalletMaintenanceService>;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = new FakeNavController().createSpy();

      coinsSpy = [
        jasmine.createSpyObj('Coin', {}, { value: 'USDC', network: 'MATIC' }),
        jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' }),
      ];
      fakeActivatedRoute = new FakeActivatedRoute({ country: 'argentina' }, {});
      activatedRouteSpy = fakeActivatedRoute.createSpy();

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoins: coinsSpy,
      });

      providersSpy = jasmine.createSpyObj('Providers', {
        all: rawProvidersData,
        byAlias: rawProvidersData.find((provider) => provider.alias === 'PX'),
      });

      providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
        create: providersSpy,
      });
      walletMaintenanceServiceSpy = jasmine.createSpyObj('WalletMaintenanceService', {
        addCoinIfUserDoesNotHaveIt: Promise.resolve(),
      });

      TestBed.configureTestingModule({
        declarations: [DirectaPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: ProvidersFactory, useValue: providersFactorySpy },
          { provide: HttpClient, useValue: httpClientSpy },
          { provide: WalletMaintenanceService, useValue: walletMaintenanceServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(DirectaPage);
      component = fixture.componentInstance;
      component.countries = rawProviderCountriesData;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to tabs wallets and call addCoinIfUserDoesNotHaveIt when Continue is clicked', async () => {
    component.ionViewWillEnter();
    fixture.debugElement.query(By.css('ion-button[name="Continue"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tabs/wallets']);
    expect(walletMaintenanceServiceSpy.addCoinIfUserDoesNotHaveIt).toHaveBeenCalledOnceWith(coinsSpy[0]);
  });

  it('should set country, default currency and provider on init', () => {
    fakeActivatedRoute.modifySnapshotParams({ alias: 'PX' }, { country: 'ECU' });
    component.ionViewWillEnter();
    expect(component.country.name).toEqual('Ecuador');
    expect(component.selectedCurrency).toEqual(coinsSpy[0]);
    expect(component.fiatCurrency).toEqual('USD');
  });
});
