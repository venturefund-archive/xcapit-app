import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { WithdrawConfirmationPage } from './withdraw-confirmation.page';
import { ApiWalletService } from '../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { WalletEncryptionService } from '../../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from '../../../../../testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from '../../../../../testing/fakes/modal-controller.fake.spec';
import { FakeActivatedRoute } from '../../../../../testing/fakes/activated-route.fake.spec';
import { ActivatedRoute } from '@angular/router';
import { Coin } from '../../../wallets/shared-wallets/interfaces/coin.interface';
import { BigNumber, Wallet } from 'ethers';
import { TwoPiInvestment } from '../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { Provider } from '@ethersproject/abstract-provider';
import { ERC20Provider } from '../../shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { TwoPiContract } from '../../shared-defi-investments/models/two-pi-contract/two-pi-contract.model';
import { of } from 'rxjs';
import { DynamicPrice } from '../../../../shared/models/dynamic-price/dynamic-price.model';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { WithdrawConfirmationController } from './withdraw-confirmation.controller';
import { GasFeeOf } from '../../shared-defi-investments/models/gas-fee-of/gas-fee-of.model';

describe('WithdrawConfirmationPage', () => {
  let component: WithdrawConfirmationPage;
  let fixture: ComponentFixture<WithdrawConfirmationPage>;
  let nativeCoinSpy: jasmine.SpyObj<Coin>;
  let usdcCoinSpy: jasmine.SpyObj<Coin>;
  let walletSpy: Wallet;
  let investmentSpy: jasmine.SpyObj<TwoPiInvestment>;
  let investmentProductSpy: jasmine.SpyObj<InvestmentProduct>;
  let providerSpy: jasmine.SpyObj<Provider>;
  let erc20ProviderSpy: jasmine.SpyObj<ERC20Provider>;
  let twoPiContractSpy: jasmine.SpyObj<TwoPiContract>;
  let dynamicPriceSpy: jasmine.SpyObj<DynamicPrice>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let fakeNavController: FakeNavController;
  let fakeModalController: FakeModalController;
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;
  let investmentDataServiceSpy: jasmine.SpyObj<InvestmentDataService>;
  let controllerSpy: jasmine.SpyObj<WithdrawConfirmationController>;
  let gasFeeOfSpy: jasmine.SpyObj<GasFeeOf>;
  beforeEach(
    waitForAsync(() => {
      fakeActivatedRoute = new FakeActivatedRoute({ vault: 'usdc_mumbai' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      fakeNavController = new FakeNavController();
      fakeModalController = new FakeModalController({ data: 'fake_password' });
      navControllerSpy = fakeNavController.createSpy();
      modalControllerSpy = fakeModalController.createSpy();
      dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(4000) });
      gasFeeOfSpy = jasmine.createSpyObj('GasFeeOf', { value: of(4000) });
      erc20ProviderSpy = jasmine.createSpyObj('ERC20Provider', {
        value: {},
        coin: { contract: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38', abi: [] },
      });

      investmentSpy = jasmine.createSpyObj('Investment', {
        balance: Promise.resolve({ wait: () => Promise.resolve() }),
        withdraw: Promise.resolve({ wait: () => Promise.resolve() }),
        withdrawAll: Promise.resolve({ wait: () => Promise.resolve() }),
        amountToShare: Promise.resolve(BigNumber.from(10)),
      });

      twoPiContractSpy = jasmine.createSpyObj('TwoPiContract', {
        value: {},
      });

      controllerSpy = jasmine.createSpyObj('Controller', {
        createDynamicPrice: dynamicPriceSpy,
        createGasFeeOf: gasFeeOfSpy,
        createErc20Provider: erc20ProviderSpy,
        withdrawFeeContract: twoPiContractSpy,
        investment: investmentSpy,
        createFormattedFee: { value: () => Promise.resolve(10) },
      });

      providerSpy = jasmine.createSpyObj(
        'Provider',
        { getGasPrice: Promise.resolve(BigNumber.from('10')) },
        {
          _isProvider: true,
        }
      );
      usdcCoinSpy = jasmine.createSpyObj('Coin', {}, { native: false, value: 'USDC', network: 'MATIC' });

      investmentProductSpy = jasmine.createSpyObj('InvestmentProduct', {
        id: 3,
        token: usdcCoinSpy,
        contractAddress: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38',
        name: 'usdc',
        value: 'USDC',
      });

      investmentDataServiceSpy = jasmine.createSpyObj(
        'InvestmentDataService',
        {},
        {
          amount: 10,
          quoteAmount: 12,
          product: investmentProductSpy,
          investment: {},
        }
      );

      nativeCoinSpy = jasmine.createSpyObj('Coin', {}, { native: true, value: 'MATIC', network: 'MATIC' });

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoinsFromNetwork: [usdcCoinSpy, nativeCoinSpy],
        getCoins: [usdcCoinSpy, nativeCoinSpy],
      });

      walletSpy = jasmine.createSpyObj(
        'Wallet',
        {},
        {
          address: '0x000001',
        }
      );

      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
        getEncryptedWallet: Promise.resolve({ addresses: { MATIC: '0x00000001' } }),
        getDecryptedWalletForCurrency: Promise.resolve(walletSpy),
      });

      toastServiceSpy = jasmine.createSpyObj('ToastService', {
        showErrorToast: Promise.resolve(),
        showWarningToast: Promise.resolve(),
      });

      walletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', { balanceOf: Promise.resolve('51') });

      TestBed.configureTestingModule({
        declarations: [WithdrawConfirmationPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: ToastService, useValue: toastServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletBalanceService, useValue: walletBalanceServiceSpy },
          { provide: InvestmentDataService, useValue: investmentDataServiceSpy },
          { provide: WithdrawConfirmationController, useValue: controllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WithdrawConfirmationPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load properly data on DidEnter', async () => {
    await component.ionViewDidEnter();
    expect(component.investmentProduct).toEqual(investmentProductSpy);
    expect(component.amount).toEqual({ value: 10, token: 'USDC' });
    expect(component.quoteAmount).toEqual({ value: 40000, token: 'USD' });
    expect(component.token).toEqual(usdcCoinSpy);
    expect(component.fee).toEqual({ value: 10, token: 'MATIC' });
    expect(controllerSpy.createDynamicPrice).toHaveBeenCalledTimes(2);
  });

  it('should withdraw', async () => {
    await component.ionViewDidEnter();
    await component.withdraw();
    await fixture.whenStable();
    expect(investmentSpy.withdraw).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/defi/withdraw/success');
  });

  it('should withdrawAll', async () => {
    fakeActivatedRoute.modifySnapshotParams({
      type: 'all',
    });
    await component.ionViewDidEnter();
    await component.withdraw();
    await fixture.whenStable();
    expect(investmentSpy.withdrawAll).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/defi/withdraw/success');
  });

  it('should not withdraw if invalid password', async () => {
    walletEncryptionServiceSpy.getDecryptedWalletForCurrency.and.rejectWith();
    await component.ionViewDidEnter();
    await component.withdraw();
    await fixture.whenStable();
    expect(investmentSpy.withdraw).not.toHaveBeenCalled();
  });

  it('should not withdraw if no password', async () => {
    fakeModalController.modifyReturns({ data: null }, null);
    await component.ionViewDidEnter();
    await component.withdraw();
    await fixture.whenStable();
    expect(investmentSpy.withdraw).not.toHaveBeenCalled();
  });

  it('should navigate to error page if error', async () => {
    investmentSpy.withdraw.and.rejectWith();
    await component.ionViewDidEnter();
    await component.withdraw();
    await fixture.whenStable();
    expect(investmentSpy.withdraw).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/defi/withdraw/error', 'usdc_mumbai']);
  });

  it('should unsubscribe when leave', () => {
    const nextSpy = spyOn(component.leave$, 'next');
    const completeSpy = spyOn(component.leave$, 'complete');
    component.ionViewWillLeave();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should not show informative modal of fees on withdraw when the native token balance is bigger than the cost of fees', async () => {
    providerSpy.getGasPrice.and.returnValue(Promise.resolve(BigNumber.from('100000')));
    await component.ionViewDidEnter();
    await component.withdraw();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(toastServiceSpy.showWarningToast).toHaveBeenCalledTimes(0);
  });

  it('should show informative modal of fees on withdraw when the native token balance is lower than the cost of fees', async () => {
    walletBalanceServiceSpy.balanceOf.and.returnValue(Promise.resolve(0.00001));
    providerSpy.getGasPrice.and.returnValue(Promise.resolve(BigNumber.from('1000000000000')));
    fixture.detectChanges();
    await component.ionViewDidEnter();
    await component.withdraw();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(toastServiceSpy.showWarningToast).toHaveBeenCalledTimes(1);
  });
});
