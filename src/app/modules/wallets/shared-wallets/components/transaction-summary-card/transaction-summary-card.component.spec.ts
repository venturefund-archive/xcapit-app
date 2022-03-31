import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TransactionSummaryCardComponent } from './transaction-summary-card.component';
import { SummaryData } from '../../../send/send-summary/interfaces/summary-data.interface';
import { By } from '@angular/platform-browser';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormattedNetworkPipe } from '../../pipes/formatted-network-name/formatted-network.pipe';

const summaryData: SummaryData = {
  network: 'ERC20',
  currency: {
    id: 1,
    name: 'BTC - Bitcoin',
    logoRoute: '../../assets/img/coins/BTC.svg',
    last: false,
    value: 'BTC',
    network: '',
    chainId: 42,
    rpc: '',
  },
  address: 'asdlkfjasd56lfjasdpodlfkj',
  amount: '1',
  referenceAmount: '50000',
};

const nativeToken = {
  chainId: 42,
  id: 1,
  last: false,
  logoRoute: "assets/img/coins/ETH.svg",
  moonpayCode: "keth",
  name: "ETH - Ethereum",
  native: true,
  network: "ERC20",
  rpc: "https://eth-kovan.alchemyapi.io/v2/tfmomSigQreoKgOjz0W9W-j5SdtKkiZN",
  symbol: "ETHUSDT",
  value: "ETH"
};
fdescribe('TransactionSummaryCardComponent', () => {
  let component: TransactionSummaryCardComponent;
  let fixture: ComponentFixture<TransactionSummaryCardComponent>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;

  beforeEach(() => {
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
      getNativeTokenFromNetwork: nativeToken,
    });
    TestBed.configureTestingModule({
      declarations: [TransactionSummaryCardComponent, FormattedNetworkPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: ApiWalletService, useValue: apiWalletServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionSummaryCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be rendered properly', async () => {
    component.summaryData = summaryData;
    component.amountsTitle = 'Test title';
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const nameAndIconEl = fixture.debugElement.query(By.css('.tsc__name-and-icon'));
    expect(nameAndIconEl.nativeElement.innerHTML).toContain('BTC - Bitcoin');
    expect(nameAndIconEl.nativeElement.innerHTML).toContain('ERC20');

    const amountEl = fixture.debugElement.query(By.css('.tsc__amount'));
    expect(amountEl.nativeElement.innerHTML).toContain('Test title');
    expect(amountEl.nativeElement.innerHTML).toContain('1 BTC');
    expect(amountEl.nativeElement.innerHTML).toContain('50000 USD');

    const addressEl = fixture.debugElement.query(By.css('.tsc__address'));
    expect(addressEl.nativeElement.innerHTML).toContain('asdlkfjasd56lfjasdpodlfkj');
  });
});
