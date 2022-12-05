import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { TransactionSummaryCardComponent } from './transaction-summary-card.component';
import { SummaryData } from '../../../send/send-summary/interfaces/summary-data.interface';
import { By } from '@angular/platform-browser';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormattedNetworkPipe } from '../../../../../shared/pipes/formatted-network-name/formatted-network.pipe';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const summaryData: SummaryData = {
  network: 'ERC20',
  currency: {
    id: 1,
    name: 'BTC - Bitcoin',
    logoRoute: '../../assets/img/coins/BTC.svg',
    value: 'BTC',
    network: '',
    chainId: 42,
    rpc: '',
  },
  address: 'asdlkfjasd56lfjasdpodlfkj',
  amount: 1,
  referenceAmount: '50000',
  fee: '0.00001',
  referenceFee: '0.18',
};

const nativeToken = {
  chainId: 42,
  id: 1,
  last: false,
  logoRoute: 'assets/img/coins/ETH.svg',
  moonpayCode: 'keth',
  name: 'ETH - Ethereum',
  native: true,
  network: 'ERC20',
  rpc: 'https://eth-kovan.alchemyapi.io/v2/tfmomSigQreoKgOjz0W9W-j5SdtKkiZN',
  symbol: 'ETHUSDT',
  value: 'ETH',
};

describe('TransactionSummaryCardComponent', () => {
  let component: TransactionSummaryCardComponent;
  let fixture: ComponentFixture<TransactionSummaryCardComponent>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<TransactionSummaryCardComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
      getNativeTokenFromNetwork: nativeToken,
    });
    TestBed.configureTestingModule({
      declarations: [
        TransactionSummaryCardComponent,
        FormattedNetworkPipe,
        FormattedAmountPipe,
        FakeTrackClickDirective,
      ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionSummaryCardComponent);
    component = fixture.componentInstance;
    component.summaryData = summaryData;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
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

    const feeEl = fixture.debugElement.query(By.css('.tsc__fee'));
    expect(feeEl.nativeElement.innerHTML).toContain('wallets.send.send_summary.fee');
    expect(feeEl.nativeElement.innerHTML).toContain('0.00001 ETH');
    expect(feeEl.nativeElement.innerHTML).toContain('0.18 USD');
  });

  it('should show modal on trackService when ux_phrase_information clicked', () => {
    component.amountSend = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_phrase_information');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit event and when ux_phrase_information clicked', () => {
    component.amountSend = true;
    fixture.detectChanges();
    const spy = spyOn(component.phraseAmountInfoClicked, 'emit');
    const infoButtonel = fixture.debugElement.query(By.css('ion-button[name="ux_phrase_information"]'));
    infoButtonel.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show modal on trackService when transactionFee clicked', () => {
    component.transactionFee = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'transaction_fee');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit event and when transaction fee clicked', () => {
    component.transactionFee = true;
    fixture.detectChanges();
    const spy = spyOn(component.phrasetransactionFeeInfoClicked, 'emit');
    const infoButtonel = fixture.debugElement.query(By.css('ion-button[name="transaction_fee"]'));
    infoButtonel.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
