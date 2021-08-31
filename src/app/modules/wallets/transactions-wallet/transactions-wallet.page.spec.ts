import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { WalletTransactionService } from '../shared-wallets/services/wallet-transaction/wallet-transaction.service';
import { Storage } from '@ionic/storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TransactionsWalletPage } from './transactions-wallet.page';
import { By } from '@angular/platform-browser';

const transaction = [
  {
    icon: 'assets/img/wallet-transactions/received.svg',
    type: 'received',
    asset: 'ETH',
    from: '0x00000000000000000000000000',
    to: '0x00000000000000000000000001',
    value: '0.2',
    hash: '0x000000000000000000000000000000000000000000001',
    blockNumber: '0x00000001',
    erc721: false,
    rawContract: false,
    swap: {
      currencyIn: '',
      currencyOut: '',
      amountIn: null,
      amounOut: null,
    },
  },
];

describe('TransactionsWalletPage', () => {
  let component: TransactionsWalletPage;
  let fixture: ComponentFixture<TransactionsWalletPage>;
  let walletTransactionServiceMock: any;
  let walletTransactionService: WalletTransactionService;
  let storageSpy: any;

  beforeEach(
    waitForAsync(() => {
      walletTransactionServiceMock = {
        getAllTransactions: () => Promise.resolve(transaction),
      };
      storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);

      TestBed.configureTestingModule({
        declarations: [TransactionsWalletPage],
        imports: [TranslateModule.forRoot(), IonicModule, HttpClientTestingModule],
        providers: [
          { provider: WalletTransactionService, useValue: walletTransactionServiceMock },
          { provide: Storage, useValue: storageSpy },
          UrlSerializer,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(TransactionsWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      walletTransactionService = TestBed.inject(WalletTransactionService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the all transaction on IonViewWillEnter', async () => {
    spyOn(walletTransactionService, 'getAllTransactions').and.returnValue(Promise.resolve(transaction));
    fixture.detectChanges();
    await component.ionViewWillEnter();

    fixture.whenStable().then(() => {
      expect(component.allTransactions).toBe(transaction);
    });
  });
});
