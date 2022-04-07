import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { OperationsNewPage } from './operations-new.page';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';

const storageData = {
  valid: {
    data: {
      pais: 'country',
      operacion: 'cash-in',
      par: 'one_pair',
      monto_entrada: '100',
      monto_salida: '100',
      moneda_entrada: 'ARS',
      moneda_salida: 'USDT',
      precio_entrada: '1',
      precio_salida: '100',
      wallet: '0x000000000000000000000dead',
    },
    valid: true,
  },
  invalid: {
    data: {
      pais: '',
      operacion: '',
      par: '',
      monto_entrada: '',
      monto_salida: '',
      moneda_entrada: '',
      moneda_salida: '',
      precio_entrada: '',
      precio_salida: '',
      wallet: '',
    },
    valid: false,
  },
};

const fakeQuotations = {
  data: [
    {
      currency: 'usdt',
      market_price: { usd: 1.0, ars: 191.4, ves: 4.42, uyu: 45.6, pen: 0.0, cop: 3725.0, crc: 640.0 },
      quotations: { ars: { sell: 197.14, buy: 185.66, swap_sell: 193.31, swap_buy: 189.49 } },
    },
  ],
};

const validForm = {
  pais: 'Argentina',
  type: 'cash-in',
  pair: 'ARS_USDT',
  currency_in: 'ARS',
  currency_out: 'USDT',
  amount_in: '',
  amount_out: '1',
  wallet: '0x0000000000000000000dead',
  price_in: '145',
  price_out: '1',
};

const userNew = {
  id: false,
  registration_status: 'USER_INFORMATION',
};

describe('RampsMenuPage', () => {
  let component: OperationsNewPage;
  let fixture: ComponentFixture<OperationsNewPage>;
  let storageOperationServiceSpy: jasmine.SpyObj<StorageOperationService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<OperationsNewPage>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      storageOperationServiceSpy = jasmine.createSpyObj('StorageOperationService', {
        updateData: null,
      });
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
        getQuotations: of(fakeQuotations),
        getUserWallets: of({}),
        checkUser: of({}),
        createUser: of({}),
      });

      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
        getEncryptedWallet: Promise.resolve({ addresses: { ERC20: '0x00000000000000' } }),
      });

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoins: [{ network: 'ERC20', value: 'USDT' }],
      });

      TestBed.configureTestingModule({
        declarations: [OperationsNewPage, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [HttpClientTestingModule, IonicModule, TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: StorageOperationService, useValue: storageOperationServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsNewPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save operation and create user on handleSubmit and valid form', async () => {
    storageOperationServiceSpy.updateData.and.returnValue();
    component.form.patchValue(validForm);
    component.getQuotations();
    component.form.patchValue({ amount_in: 500 });
    component.setOutAmount();

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    component.handleSubmit();
    expect(storageOperationServiceSpy.updateData).toHaveBeenCalledTimes(1);
    expect(fiatRampsServiceSpy.checkUser).toHaveBeenCalledTimes(1);
    expect(fiatRampsServiceSpy.createUser).toHaveBeenCalledTimes(1);
  });

  it('should redirect user when user exist on handleSubmit and valid form', async () => {
    fiatRampsServiceSpy.checkUser.and.returnValue(of(userNew));
    component.form.patchValue(validForm);
    component.getQuotations();
    component.form.patchValue({ amount_in: 500 });
    component.setOutAmount();

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    component.handleSubmit();
    expect(fiatRampsServiceSpy.checkUser).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
  });

  it('should redirect to user information form when status is USER_INFORMATION', () => {
    const url = component.getUrlByStatus('USER_INFORMATION');
    expect(url).toEqual(['fiat-ramps/user-information']);
  });

  it('should redirect to user bank information form when status is USER_BANK', () => {
    const url = component.getUrlByStatus('USER_BANK');
    expect(url).toEqual(['fiat-ramps/user-bank']);
  });

  it('should redirect to user images upload form when status is USER_IMAGES', () => {
    const url = component.getUrlByStatus('USER_IMAGES');
    expect(url).toEqual(['fiat-ramps/user-images']);
  });

  it('should redirect to new order confirm when status is COMPLETE', () => {
    const url = component.getUrlByStatus('COMPLETE');
    expect(url).toEqual(['fiat-ramps/confirm-page']);
  });

  it('should call trackEvent on trackService when Next Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Next');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
