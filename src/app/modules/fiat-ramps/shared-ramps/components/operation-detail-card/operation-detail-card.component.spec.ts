import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TEST_MATIC_COINS } from 'src/app/modules/wallets/shared-wallets/constants/coins.test';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { FormattedNetworkPipe } from 'src/app/shared/pipes/formatted-network-name/formatted-network.pipe';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';
import { OperationStatus } from '../../interfaces/operation-status.interface';
import { FiatRampsService } from '../../services/fiat-ramps.service';
import { OperationStatusChipComponent } from '../operation-status-chip/operation-status-chip.component';
import { OperationDetailCardComponent } from './operation-detail-card.component';

const testOperation: FiatRampOperation = {
  operation_id: 364,
  operation_type: 'cash-in',
  status: 'pending_by_validate',
  currency_in: 'ars',
  amount_in: 150.25,
  currency_out: 'MATIC',
  amount_out: 2.5,
  created_at: new Date('2022-05-13T17:30:23.258Z'),
  provider: '1',
  voucher: false,
};

const testProvider: FiatRampProvider = {
  id: 1,
  alias: 'kripton',
  name: 'Kripton Market',
  logoRoute: 'assets/img/provider-logos/KriptonMarket.svg',
  description: 'fiat_ramps.select_provider.krypton_description',
  disclaimer: 'fiat_ramps.shared.constants.providers.kripton.disclaimer',
  newOperationRoute: '/fiat-ramps/new-operation/kripton',
  trackClickEventName: "ux_buy_kripton",
  countries: ['Argentina', 'Venezuela', 'Uruguay', 'Colombia'],
  currencies: [
    { symbol: 'DAI', network: 'MATIC' },
    { symbol: 'MATIC', network: 'MATIC' },
  ],
};

const testStatus: OperationStatus = {
  providerId: 1,
  name: 'pending_by_validate',
  textToShow: 'in_progress',
  colorCssClass: 'warning'
};

const testCoin = TEST_MATIC_COINS[0];
const testAddress = '0x0000000000000000000000000000000000000000';
const testNetwork = 'MATIC';

describe('OperationDetailCardComponent', () => {
  let component: OperationDetailCardComponent;
  let fixture: ComponentFixture<OperationDetailCardComponent>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let apiWalletSertviceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;

  beforeEach(waitForAsync(() => {
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getOperationStatus: testStatus,
    });
    apiWalletSertviceSpy = jasmine.createSpyObj('ApiWalletSertvice', {
      getCoin: testCoin
    });
    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      getEncryptedWallet: Promise.resolve({
        addresses: {
          MATIC: testAddress
        }
      })
    });
    TestBed.configureTestingModule({
      declarations: [ OperationDetailCardComponent, OperationStatusChipComponent, FormattedNetworkPipe ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ApiWalletService, useValue: apiWalletSertviceSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationDetailCardComponent);
    component = fixture.componentInstance;
    component.operation = testOperation;
    component.provider = testProvider;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render data correctly', async () => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();

    const coinLogoEl = fixture.debugElement.query(By.css('div[name="Coin Logo"] > img'));
    const coinNameEl = fixture.debugElement.query(By.css('div[name="Coin Name"]'));
    const operationEl = fixture.debugElement.query(By.css('div[name="Operation Type Detail"]'));
    const amountEl = fixture.debugElement.query(By.css('div[name="Amount"]'));
    const quotationEl = fixture.debugElement.query(By.css('div[name="Quotation"]'));
    const providerEl = fixture.debugElement.query(By.css('div[name="Provider"]'));
    const addressEl = fixture.debugElement.query(By.css('div[name="Address"]'));
    const networkEl = fixture.debugElement.query(By.css('div[name="Network"]'));

    expect(coinLogoEl.attributes['src']).toEqual('assets/img/coins/MATIC.png');
    expect(coinNameEl.nativeElement.innerText).toContain('MATIC Polygon');
    expect(operationEl.nativeElement.innerText).toContain('MATIC fiat_ramps.operation_detail.detail_card.with ARS');
    expect(amountEl.nativeElement.innerText).toContain('150.25 ARS');
    expect(quotationEl.nativeElement.innerText).toContain('1 MATIC = 60.10 ARS');
    expect(providerEl.nativeElement.innerText).toContain('Kripton Market');
    expect(addressEl.nativeElement.innerText).toContain(testAddress);
    expect(networkEl.nativeElement.innerText).toContain('Polygon');
  });

  it('should get operation status, wallet address and network on ionViewWillEnter', async () => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.address).toEqual(testAddress);
    expect(component.network).toEqual(testNetwork);
    expect(component.operationStatus).toEqual(testStatus);
  });
});
