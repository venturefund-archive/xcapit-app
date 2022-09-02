import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { ConfirmPagePage } from './confirm-page.page';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { WalletMaintenanceService } from '../../wallets/shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TEST_COINS } from '../../wallets/shared-wallets/constants/coins.test';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { TrackService } from 'src/app/shared/services/track/track.service';

const storageData = {
  valid: {
    data: {
      country: 'country',
      type: 'cash-in',
      pair: 'ARS_USDT',
      amount_in: '100',
      amount_out: '100',
      currency_in: 'ARS',
      currency_out: 'USDT',
      price_in: '1',
      price_out: '100',
      wallet: '0x000000000000000000000dead',
      provider: '1',
    },
    valid: true,
  },
  invalid: {
    data: {
      country: '',
      type: '',
      pair: '',
      amount_in: '',
      amount_out: '',
      currency_in: '',
      currency_out: '',
      price_in: '',
      price_out: '',
      wallet: '',
      provider: '',
    },
    valid: false,
  },
};

const operationId = 6;

describe('ConfirmPagePage', () => {
  let component: ConfirmPagePage;
  let fixture: ComponentFixture<ConfirmPagePage>;
  let storageOperationServiceSpy: jasmine.SpyObj<StorageOperationService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ConfirmPagePage>;
  let walletMaintenanceServiceSpy: jasmine.SpyObj<WalletMaintenanceService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;


  beforeEach(
    waitForAsync(() => {
      navControllerSpy = new FakeNavController().createSpy();
      storageOperationServiceSpy = jasmine.createSpyObj(
        'StorageOperationService',
        {
          setOperationId: null,
        },
        {
          data: of(storageData.valid.data),
        }
      );
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        createOperation: of({ id: operationId }),
      });
      walletMaintenanceServiceSpy = jasmine.createSpyObj('WalletMaintenanceService', {
        addCoinIfUserDoesNotHaveIt: Promise.resolve(),
      });

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoin: TEST_COINS[2],
      });

      providersSpy = jasmine.createSpyObj('Providers', {
        all: rawProvidersData,
      });

      providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
        create: providersSpy,
      });

      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy',{
        trackEvent: Promise.resolve(true),
      })

      TestBed.configureTestingModule({
        declarations: [ConfirmPagePage, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [IonicModule, TranslateModule.forRoot()],
        providers: [
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: StorageOperationService, useValue: storageOperationServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletMaintenanceService, useValue: walletMaintenanceServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: ProvidersFactory, useValue: providersFactorySpy },
          { provide: TrackService, useValue: trackServiceSpy}
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createOperation and addCoinIfUserDoesNotHaveIt on click confirm button', async () => {
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_buy_kripton_confirm');
    el.nativeElement.click();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(fiatRampsServiceSpy.createOperation).toHaveBeenCalledTimes(1);
    expect(walletMaintenanceServiceSpy.addCoinIfUserDoesNotHaveIt).toHaveBeenCalledOnceWith(TEST_COINS[2]);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/success-page', 6]);
  });

  it('should call trackEvent on trackService when ux_buy_kripton_confirm Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_buy_kripton_confirm');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get provider_id from operationData', () => {
    const spy = spyOn(component, 'getProvider').and.callThrough();
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
