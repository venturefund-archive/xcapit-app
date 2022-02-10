import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SendAmountInputCardComponent } from './send-amount-input-card.component';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionDataService } from '../../services/transaction-data/transaction-data.service';
import { constants } from 'ethers';
import { TEST_ERC20_COINS } from '../../constants/coins.test';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { WalletTransactionsService } from '../../services/wallet-transactions/wallet-transactions.service';

describe('SendAmountInputCardComponent', () => {
  let component: SendAmountInputCardComponent;
  let fixture: ComponentFixture<SendAmountInputCardComponent>;
  let controlContainerMock: FormGroup;
  let formGroupDirectiveMock: FormGroupDirective;
  let apiWalletServiceSpy: any;
  let transactionDataServiceSpy: jasmine.SpyObj<TransactionDataService>;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService>;
  let toastService: jasmine.SpyObj<ToastService>;
  beforeEach(() => {
    toastService = jasmine.createSpyObj('ToastService', { showErrorToast: Promise.resolve() });
    transactionDataServiceSpy = jasmine.createSpyObj('TransactionDataService', 
      {},
      {
        transactionData: {
          address: constants.AddressZero,
          amount: '10',
          currency: JSON.parse(JSON.stringify(TEST_ERC20_COINS[1]))
        }
      }
    );
    walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionsService', { sendEstimatedFee: Promise.resolve('0.00012') });
    controlContainerMock = new FormBuilder().group({
      amount: ['', []],
      referenceAmount: ['', []],
    });
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getPrices: of({ prices: { LINK: 25.5, ETH: 4201.23 } }),
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;
    TestBed.configureTestingModule({
      declarations: [SendAmountInputCardComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
        { provide: TransactionDataService, useValue: transactionDataServiceSpy },
        { provide: ToastService, useValue: toastService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SendAmountInputCardComponent);
    component = fixture.componentInstance;
    component.currencyName = 'LINK';
    component.nativeTokenName = 'ETH';
    component.referenceCurrencyName = 'USDT';
    component.title = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set reference equivalent value when amount change', async () => {
    component.ngOnInit();
    component.form.patchValue({ amount: '20' });
    await fixture.whenStable();
    expect(apiWalletServiceSpy.getPrices).toHaveBeenCalledWith(['LINK', 'ETH'], false);
    expect(component.form.get('amount').value).toEqual('20');
    expect(component.form.get('referenceAmount').value).toEqual(510);
  });

  it('should estimate fee and fee value in usdt on estimateFee', async () => {
    await component.estimateFee(4201.42);
    expect(component.fee).toEqual('0.00012');
    expect(component.referenceFee).toEqual('0.50417');
  })

  it('should show toast error if address to is invalid', async () => {
    const txData = {
      address: 'test',
      amount: '10',
      currency: JSON.parse(JSON.stringify(TEST_ERC20_COINS[1]))
    };
    (Object.getOwnPropertyDescriptor(transactionDataServiceSpy, 'transactionData').get as jasmine.Spy).and.returnValue(txData);
    component.ngOnInit();
    await fixture.whenStable();
    component.form.patchValue({ amount: '20' });
    await fixture.whenStable();
    expect(toastService.showErrorToast).toHaveBeenCalledTimes(2);
  });

  it('should show toast error if address to is empty', async () => {
    const txData = {
      address: '',
      amount: '10',
      currency: JSON.parse(JSON.stringify(TEST_ERC20_COINS[1]))
    };
    (Object.getOwnPropertyDescriptor(transactionDataServiceSpy, 'transactionData').get as jasmine.Spy).and.returnValue(txData);
    component.ngOnInit();
    await fixture.whenStable();
    component.form.patchValue({ amount: '20' });
    await fixture.whenStable();
    expect(toastService.showErrorToast).toHaveBeenCalledTimes(2);
  });
});
