import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';

import { InvestmentConfirmationPage } from './investment-confirmation.page';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { WalletService } from '../../../wallets/shared-wallets/services/wallet/wallet.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WalletEncryptionService } from '../../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { FakeNavController } from '../../../../../testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from '../../../../../testing/fakes/modal-controller.fake.spec';
import { Wallet } from 'ethers';

fdescribe('InvestmentConfirmationPage', () => {
  let component: InvestmentConfirmationPage;
  let fixture: ComponentFixture<InvestmentConfirmationPage>;
  let investmentDataServiceSpy: jasmine.SpyObj<InvestmentDataService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let wallet: Wallet;
  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      investmentDataServiceSpy = jasmine.createSpyObj(
        'InvestmentDataService',
        {},
        {
          product: { token: () => ({ value: 'USDC' }) },
          amount: 50,
          quoteAmount: 100,
        }
      );
      walletServiceSpy = jasmine.createSpyObj('WalletService', { walletExist: Promise.resolve(true) });
      wallet = Wallet.fromMnemonic(
        'clever brain critic belt soldier daring own luxury begin plate orange banana',
        "m/44'/80001'/0'/0/0"
      );
      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
        getDecryptedWalletForCurrency: wallet,
      });
      TestBed.configureTestingModule({
        declarations: [InvestmentConfirmationPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: InvestmentDataService, useValue: investmentDataServiceSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(InvestmentConfirmationPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
