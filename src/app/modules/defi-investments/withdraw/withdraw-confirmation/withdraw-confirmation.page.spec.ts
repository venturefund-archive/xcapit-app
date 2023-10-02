import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController, AlertController } from '@ionic/angular';
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
import { DefaultERC20Provider } from '../../shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { TwoPiContract } from '../../shared-defi-investments/models/two-pi-contract/two-pi-contract.model';
import { of } from 'rxjs';
import { DynamicPrice } from '../../../../shared/models/dynamic-price/dynamic-price.model';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { WithdrawConfirmationInjectable } from './withdraw-confirmation.injectable';
import { GasFeeOf } from '../../../../shared/models/gas-fee-of/gas-fee-of.model';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { By } from '@angular/platform-browser';
import { LocalNotificationInjectable } from 'src/app/shared/models/local-notification/injectable/local-notification.injectable';
import { FakeLocalNotification } from 'src/app/shared/models/local-notification/fake/fake-local-notification';
import { GasStationOfFactory } from 'src/app/modules/swaps/shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/default/default-blockchains';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { rawBlockchainsData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { fixedGasPriceTo } from 'src/testing/fixed-gas-price.spec';

describe('WithdrawConfirmationPage', () => {
  const weiGasPriceTestValue = '10';
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));
  let component: WithdrawConfirmationPage;
  let fixture: ComponentFixture<WithdrawConfirmationPage>;
  let nativeCoinSpy: jasmine.SpyObj<Coin>;
  let usdcCoinSpy: jasmine.SpyObj<Coin>;
  let walletSpy: Wallet;
  let investmentSpy: jasmine.SpyObj<TwoPiInvestment>;
  let investmentProductSpy: jasmine.SpyObj<InvestmentProduct>;
  let erc20ProviderSpy: jasmine.SpyObj<DefaultERC20Provider>;
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
  let withdrawConfirmationInjectableSpy: jasmine.SpyObj<WithdrawConfirmationInjectable>;
  let gasFeeOfSpy: jasmine.SpyObj<GasFeeOf>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let alertSpy: jasmine.SpyObj<HTMLIonAlertElement>;
  let localNotificationInjectableSpy: jasmine.SpyObj<LocalNotificationInjectable>;
  let testLocalNotificationOk: { title: string; body: string };
  let testLocalNotificationNotOk: { title: string; body: string };
  let fakeLocalNotification: FakeLocalNotification;
  let gasStationOfFactorySpy: jasmine.SpyObj<GasStationOfFactory>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;

  beforeEach(waitForAsync(() => {
    testLocalNotificationOk = {
      title: 'defi_investments.withdraw_notifications.success.title',
      body: 'defi_investments.withdraw_notifications.success.body',
    };

    testLocalNotificationNotOk = {
      title: 'defi_investments.withdraw_notifications.error.title',
      body: 'defi_investments.withdraw_notifications.error.body',
    };
    alertSpy = jasmine.createSpyObj('Alert', { present: Promise.resolve() });
    alertControllerSpy = jasmine.createSpyObj('AlertController', { create: Promise.resolve(alertSpy) });
    fakeActivatedRoute = new FakeActivatedRoute({ vault: 'usdc_mumbai' });
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    fakeNavController = new FakeNavController();
    fakeModalController = new FakeModalController({ data: 'fake_password' });
    navControllerSpy = fakeNavController.createSpy();
    modalControllerSpy = fakeModalController.createSpy();
    dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(4000) });
    gasFeeOfSpy = jasmine.createSpyObj('GasFeeOf', { value: Promise.resolve(BigNumber.from(4000)) });
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

    withdrawConfirmationInjectableSpy = jasmine.createSpyObj('Controller', {
      createDynamicPrice: dynamicPriceSpy,
      createGasFeeOf: gasFeeOfSpy,
      createErc20Provider: erc20ProviderSpy,
      withdrawFeeContract: twoPiContractSpy,
      investment: investmentSpy,
      createFormattedFee: { value: () => Promise.resolve(10) },
    });

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

    fakeLocalNotification = new FakeLocalNotification();

    localNotificationInjectableSpy = jasmine.createSpyObj('LocalNotificationInjectable', {
      create: fakeLocalNotification,
    });

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

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    gasStationOfFactorySpy = jasmine.createSpyObj('GasStationOfFactory', {
      create: fixedGasPriceTo(weiGasPriceTestValue, rawMATICData),
    });

    walletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', { balanceOf: Promise.resolve('51') });

    TestBed.configureTestingModule({
      declarations: [WithdrawConfirmationPage, FormattedAmountPipe],
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
        { provide: WithdrawConfirmationInjectable, useValue: withdrawConfirmationInjectableSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: LocalNotificationInjectable, useValue: localNotificationInjectableSpy },
        { provide: GasStationOfFactory, useValue: gasStationOfFactorySpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WithdrawConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load properly data on DidEnter', async () => {
    await component.ionViewDidEnter();

    expect(component.investmentProduct).toEqual(investmentProductSpy);
    expect(component.amount).toEqual({ value: 10, token: 'USDC' });
    expect(component.quoteAmount).toEqual({ value: 40000, token: 'USD' });
    expect(component.token).toEqual(usdcCoinSpy);
    expect(component.withdrawFee).toEqual({ value: 10 * 0.00255, token: 'USDC' });
    expect(component.withdrawFeeQuote).toEqual({ value: 40000 * 0.00255, token: 'USD' });
    expect(component.fee).toEqual({ value: 0.00000000000004, token: 'MATIC' });
    expect(component.receiveAprox).toEqual({
      value: component.amount.value - component.withdrawFee.value,
      token: component.amount.token,
    });
    expect(component.receiveAproxQuote).toEqual({
      value: component.quoteAmount.value - component.withdrawFeeQuote.value,
      token: component.quoteAmount.token,
    });
    expect(withdrawConfirmationInjectableSpy.createDynamicPrice).toHaveBeenCalledTimes(2);
  });

  it('should withdraw', async () => {
    const sendSpy = spyOn(fakeLocalNotification, 'send');
    const onClickSpy = spyOn(fakeLocalNotification, 'onClick').and.callThrough();
    await component.ionViewDidEnter();
    await component.withdraw();
    await fixture.whenStable();
    fakeLocalNotification.triggerOnClick();
    expect(investmentSpy.withdraw).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(onClickSpy).toHaveBeenCalledTimes(1);
    expect(localNotificationInjectableSpy.create).toHaveBeenCalledOnceWith(
      testLocalNotificationOk.title,
      testLocalNotificationOk.body
    );
  });

  it('should withdrawAll', async () => {
    const sendSpy = spyOn(fakeLocalNotification, 'send');
    const onClickSpy = spyOn(fakeLocalNotification, 'onClick').and.callThrough();
    fakeActivatedRoute.modifySnapshotParams({
      type: 'all',
    });
    await component.ionViewDidEnter();
    await component.withdraw();
    await fixture.whenStable();
    fakeLocalNotification.triggerOnClick();
    expect(investmentSpy.withdrawAll).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(onClickSpy).toHaveBeenCalledTimes(1);
    expect(localNotificationInjectableSpy.create).toHaveBeenCalledOnceWith(
      testLocalNotificationOk.title,
      testLocalNotificationOk.body
    );
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

  it('should in progress modal and send error notification if withdraw fail', async () => {
    const sendSpy = spyOn(fakeLocalNotification, 'send');
    const onClickSpy = spyOn(fakeLocalNotification, 'onClick');
    investmentSpy.withdraw.and.rejectWith();

    await component.ionViewDidEnter();
    await component.withdraw();
    await fixture.whenStable();

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(onClickSpy).toHaveBeenCalledTimes(0);
    expect(localNotificationInjectableSpy.create).toHaveBeenCalledOnceWith(
      testLocalNotificationNotOk.title,
      testLocalNotificationNotOk.body
    );
    expect(investmentSpy.withdraw).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
  });

  it('should unsubscribe when leave', () => {
    const nextSpy = spyOn(component.leave$, 'next');
    const completeSpy = spyOn(component.leave$, 'complete');

    component.ionViewWillLeave();

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should show modal', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-icon[icon="information-circle"]')).nativeElement.click();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not show modal', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    component.isInfoModalOpen = true;

    fixture.debugElement.query(By.css('ion-icon[icon="information-circle"]')).nativeElement.click();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });

  it('should not show informative modal of fees on withdraw when the native token balance is bigger than the cost of fees', async () => {
    walletBalanceServiceSpy.balanceOf.and.returnValue(Promise.resolve(0.00001));
    await component.ionViewDidEnter();
    await component.withdraw();
    fixture.detectChanges();

    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);

    expect(toastServiceSpy.showWarningToast).toHaveBeenCalledTimes(0);
  });

  it('should show informative modal of fees on withdraw when the native token balance is lower than the cost of fees', async () => {
    gasStationOfFactorySpy.create.and.returnValue(fixedGasPriceTo('2000000000000000000', rawMATICData));
    walletBalanceServiceSpy.balanceOf.and.returnValue(Promise.resolve(0.00001));

    fixture.detectChanges();
    await component.ionViewDidEnter();
    await component.withdraw();
    fixture.detectChanges();

    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);

    expect(toastServiceSpy.showWarningToast).toHaveBeenCalledTimes(1);
  });

  it('should display alert when confirm button is clicked and fee is still calculating', async () => {
    await component.ionViewDidEnter();
    component.quoteFee.value = undefined;
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_invest_withdraw_confirm"]')).nativeElement.click();

    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should withdraw and not display alert when confirm button is clicked and fee is calculated', async () => {
    const spy = spyOn(component, 'withdraw');
    await component.ionViewDidEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_invest_withdraw_confirm"]')).nativeElement.click();

    expect(alertControllerSpy.create).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
