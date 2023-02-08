import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import {
  rawETHData,
  rawTokensData,
  rawUSDCData,
  rawUSDTData,
} from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';

import { BitrefillTokenSelectionPage } from './bitrefill-token-selection.page';

describe('BitrefillTokenSelectionPage', () => {
  let component: BitrefillTokenSelectionPage;
  let fixture: ComponentFixture<BitrefillTokenSelectionPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  const paymentMethods = [
    { value: 'USDC', network: 'MATIC', code: 'usdc_polygon' },
    { value: 'ETH', network: 'ERC20', code: 'ethereum' },
    { value: 'USDT', network: 'ERC20', code: 'usdt_erc20' },
    { value: 'USDC', network: 'ERC20', code: 'usdc_erc20' },
  ];
  const availableTokens = [rawUSDCData, rawETHData, rawUSDTData];
  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
      getCoins: rawTokensData,
    });
    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', { getObject: paymentMethods });

    TestBed.configureTestingModule({
      declarations: [BitrefillTokenSelectionPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: RemoteConfigService, useValue: remoteConfigSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BitrefillTokenSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show available tokens', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(remoteConfigSpy.getObject).toHaveBeenCalledTimes(1);
    expect(component.tplTokens).toEqual(availableTokens);
  });

  it('should navigate when token was clicked', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('app-token-selection-list')).triggerEventHandler('clickedCoin', rawUSDCData);
    fixture.detectChanges();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      'fiat-ramps/bitrefill/purchase',
      'usdc_polygon',
    ]);
  });

  it('should clean tplTokens data when ionViewWillLeave is called', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    component.ionViewWillLeave();
    fixture.detectChanges();
    expect(component.tplTokens).toEqual([]);
  });
});
