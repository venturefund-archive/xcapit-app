import {
  Investment,
  TwoPiInvestment,
} from './../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { InvestmentConfirmationPage } from './investment-confirmation.page';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { WalletService } from '../../../wallets/shared-wallets/services/wallet/wallet.service';
import { TranslateModule } from '@ngx-translate/core';
import { WalletEncryptionService } from '../../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { FakeNavController } from '../../../../../testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from '../../../../../testing/fakes/modal-controller.fake.spec';
import { Wallet } from 'ethers';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { DynamicPrice } from '../../../../shared/models/dynamic-price/dynamic-price.model';
import { of } from 'rxjs';
import { ApiWalletService } from '../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';

describe('InvestmentConfirmationPage', () => {
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
  let productSpy: jasmine.SpyObj<InvestmentProduct>;
  let investmentSpy: jasmine.SpyObj<Investment>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let dynamicPriceSpy: jasmine.SpyObj<DynamicPrice>;
  let createDynamicPriceSpy: jasmine.Spy<any>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController({ data: 'fake_password' });
      modalControllerSpy = fakeModalController.createSpy();
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      productSpy = jasmine.createSpyObj('InvestmentProduct', {
        token: { value: 'USDC' },
        contractAddress: '0xtest',
      });
      investmentDataServiceSpy = jasmine.createSpyObj(
        'InvestmentDataService',
        {},
        {
          product: productSpy,
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
      investmentSpy = jasmine.createSpyObj('Investment', {
        deposit: Promise.resolve({ wait: () => Promise.resolve() }),
      });
      toastServiceSpy = jasmine.createSpyObj('ToastService', {
        showErrorToast: Promise.resolve(),
      });
      dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(4000) });
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getPrices: of({ prices: { ETH: 4000 } }),
        getCoins: [],
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
          { provide: ToastService, useValue: toastServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(InvestmentConfirmationPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      createDynamicPriceSpy = spyOn(component, 'createDynamicPrice').and.returnValue(dynamicPriceSpy);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render transaction data properly', async () => {
    await component.ionViewDidEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();

    const productEl = fixture.debugElement.query(By.css('app-expandable-investment-info'));
    const amountEl = fixture.debugElement.query(By.css('.summary__amount__qty__amount'));
    const quoteAmountEl = fixture.debugElement.query(By.css('.summary__amount__qty__quoteAmount'));
    expect(productEl).toBeTruthy();
    expect(amountEl.nativeElement.innerHTML).toContain(50);
    expect(quoteAmountEl.nativeElement.innerHTML).toContain(100);
  });

  it('should make deposit when password is valid', async () => {
    spyOn(component, 'investment').and.returnValue(investmentSpy);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Confirm Investment"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(investmentSpy.deposit).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/defi/success-investment');
  });

  it('should not make deposit when password is valid but deposit fails', async () => {
    investmentSpy.deposit.and.returnValue(Promise.reject());
    spyOn(component, 'investment').and.returnValue(investmentSpy);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Confirm Investment"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(investmentSpy.deposit).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/defi/error-investment');
  });

  it('should not make deposit when modal closes', async () => {
    fakeModalController.modifyReturns({ data: undefined }, {});
    await component.ionViewDidEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Confirm Investment"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(walletEncryptionServiceSpy.getDecryptedWalletForCurrency).not.toHaveBeenCalled();
    expect(investmentSpy.deposit).not.toHaveBeenCalled();
  });

  it('should not make deposit when password is not valid', async () => {
    walletEncryptionServiceSpy.getDecryptedWalletForCurrency.and.rejectWith();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Confirm Investment"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(investmentSpy.deposit).not.toHaveBeenCalled();
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
      message: 'defi_investments.confirmation.password_error',
    });
  });

  it('should return an investment', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    expect(component.investment(wallet)).toBeInstanceOf(TwoPiInvestment);
  });

  it('should create dynamic price', async () => {
    await component.ionViewDidEnter();
    createDynamicPriceSpy.and.callThrough();
    expect(component.createDynamicPrice()).toBeTruthy();
  });

  it('should unsubscribe when leave', () => {
    const nextSpy = spyOn(component.leave$, 'next');
    const completeSpy = spyOn(component.leave$, 'complete');
    component.ionViewWillLeave();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
});
