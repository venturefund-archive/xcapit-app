import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { DefiInvestmentWithdrawPage } from './defi-investment-withdraw.page';
import { TwoPiApi } from '../../shared-defi-investments/models/two-pi-api/two-pi-api.model';
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
import { Vault } from '@2pi-network/sdk';
import { TwoPiInvestment } from '../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { Provider } from '@ethersproject/abstract-provider';
import { ERC20Provider } from '../../shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { TwoPiContract } from '../../shared-defi-investments/models/two-pi-contract/two-pi-contract.model';
import { of } from 'rxjs';
import { DynamicPrice } from '../../../../shared/models/dynamic-price/dynamic-price.model';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';

describe('DefiInvestmentWithdrawPage', () => {
  let component: DefiInvestmentWithdrawPage;
  let fixture: ComponentFixture<DefiInvestmentWithdrawPage>;

  let nativeCoinSpy: jasmine.SpyObj<Coin>;
  let usdcCoinSpy: jasmine.SpyObj<Coin>;
  let walletSpy: Wallet;
  let vaultSpy: jasmine.SpyObj<Vault>;
  let investmentSpy: jasmine.SpyObj<TwoPiInvestment>;
  let investmentProductSpy: jasmine.SpyObj<InvestmentProduct>;
  let providerSpy: jasmine.SpyObj<Provider>;
  let erc20ProviderSpy: jasmine.SpyObj<ERC20Provider>;
  let twoPiContractSpy: jasmine.SpyObj<TwoPiContract>;
  let dynamicPriceSpy: jasmine.SpyObj<DynamicPrice>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let twoPiApiSpy: jasmine.SpyObj<TwoPiApi>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let createDynamicPriceSpy: jasmine.Spy<any>;
  let componentInvestmentSpy: jasmine.Spy<any>;
  let createErc20ProviderSpy: jasmine.Spy<any>;
  let createInvestmentSpy: jasmine.Spy<any>;
  let withdrawFeeContractSpy: jasmine.Spy<any>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let fakeNavController: FakeNavController;
  let fakeModalController: FakeModalController;
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;

  beforeEach(
    waitForAsync(() => {
      fakeActivatedRoute = new FakeActivatedRoute({ vault: 'usdc_mumbai' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      fakeNavController = new FakeNavController();
      fakeModalController = new FakeModalController({ data: 'fake_password' });
      navControllerSpy = fakeNavController.createSpy();
      modalControllerSpy = fakeModalController.createSpy();

      providerSpy = jasmine.createSpyObj(
        'Provider',
        { getGasPrice: Promise.resolve(BigNumber.from('10')) },
        {
          _isProvider: true,
        }
      );

      erc20ProviderSpy = jasmine.createSpyObj('ERC20Provider', {
        value: providerSpy,
        coin: { contract: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38', abi: [] },
      });

      investmentSpy = jasmine.createSpyObj('Investment', {
        balance: Promise.resolve({ wait: () => Promise.resolve() }),
        withdraw: Promise.resolve({ wait: () => Promise.resolve() }),
      });

      vaultSpy = jasmine.createSpyObj(
        'Vault',
        {},
        { token: 'USDC', address: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38' }
      );

      walletSpy = Wallet.fromMnemonic(
        'clever brain critic belt soldier daring own luxury begin plate orange banana',
        "m/44'/80001'/0'/0/0"
      );

      nativeCoinSpy = jasmine.createSpyObj('Coin', {}, { native: true, value: 'MATIC', network: 'MATIC' });
      usdcCoinSpy = jasmine.createSpyObj('Coin', {}, { native: false, value: 'USDC', network: 'MATIC' });
      dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(4000) });

      investmentProductSpy = jasmine.createSpyObj('InvestmentProduct', {
        contractAddress: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38',
        token: 'USDC',
      });

      twoPiContractSpy = jasmine.createSpyObj('TwoPiContract', {
        value: { estimateGas: { withdrawAll: () => Promise.resolve(BigNumber.from('20')) } },
      });

      twoPiApiSpy = jasmine.createSpyObj('TwoPiApi', {
        vaults: Promise.resolve([vaultSpy]),
        vault: Promise.resolve(vaultSpy),
      });

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoinsFromNetwork: [usdcCoinSpy, nativeCoinSpy],
        getCoins: [usdcCoinSpy, nativeCoinSpy],
      });

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
        declarations: [DefiInvestmentWithdrawPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: TwoPiApi, useValue: twoPiApiSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: ToastService, useValue: toastServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletBalanceService, useValue: walletBalanceServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(DefiInvestmentWithdrawPage);
      component = fixture.componentInstance;
      componentInvestmentSpy = spyOn(component, 'investment').and.returnValue(investmentSpy);
      createInvestmentSpy = spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
      createErc20ProviderSpy = spyOn(component, 'createErc20Provider').and.returnValue(erc20ProviderSpy);
      withdrawFeeContractSpy = spyOn(component, 'withdrawFeeContract').and.resolveTo(twoPiContractSpy);
      createDynamicPriceSpy = spyOn(component, 'createDynamicPrice').and.returnValue(dynamicPriceSpy);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should withdraw', async () => {
    await component.ionViewDidEnter();
    await component.withdraw();
    await fixture.whenStable();
    expect(investmentSpy.withdraw).toHaveBeenCalledTimes(1);
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

  it('should create invesment', () => {
    componentInvestmentSpy.and.callThrough();
    component.investmentProduct = investmentProductSpy;
    fixture.detectChanges();
    expect(component.investment(walletSpy)).toBeTruthy();
  });

  it('should create invesment without signer', () => {
    createInvestmentSpy.and.callThrough();
    expect(component.createInvestment(investmentProductSpy, '0x111111111111')).toBeTruthy();
  });

  it('should create provider', () => {
    createErc20ProviderSpy.and.callThrough();
    expect(component.createErc20Provider()).toBeTruthy();
  });

  it('should create withdraw fee contract', () => {
    component.investmentProduct = investmentProductSpy;
    component.token = usdcCoinSpy;
    fixture.detectChanges();
    withdrawFeeContractSpy.and.callThrough();
    expect(component.withdrawFeeContract()).toBeTruthy();
  });

  it('should create Dynamic Price', () => {
    createDynamicPriceSpy.and.callThrough();
    expect(component.createDynamicPrice(usdcCoinSpy)).toBeTruthy();
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
