import { LINKS } from 'src/app/config/static-links';
import { IonicStorageService } from '../../../../shared/services/ionic-storage/ionic-storage.service';
import {
  Investment,
  TwoPiInvestment,
} from '../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { InvestmentConfirmationPage } from './investment-confirmation.page';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { WalletService } from '../../../wallets/shared-wallets/services/wallet/wallet.service';
import { TranslateModule } from '@ngx-translate/core';
import { WalletEncryptionService } from '../../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { FakeNavController } from '../../../../../testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from '../../../../../testing/fakes/modal-controller.fake.spec';
import { BigNumber, Wallet } from 'ethers';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { DynamicPrice } from '../../../../shared/models/dynamic-price/dynamic-price.model';
import { of } from 'rxjs';
import { ApiWalletService } from '../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { DefaultERC20Provider } from '../../shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { Provider } from '@ethersproject/abstract-provider';
import { ERC20Contract } from '../../shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { ActivatedRoute } from '@angular/router';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';

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
  let providerSpy: jasmine.SpyObj<Provider>;
  let erc20ProviderSpy: jasmine.SpyObj<DefaultERC20Provider>;
  let erc20ContractSpy: jasmine.SpyObj<ERC20Contract>;
  let createDynamicPriceSpy: jasmine.Spy<any>;
  let createErc20ProviderSpy: jasmine.Spy<any>;
  let approveFeeContractSpy: jasmine.Spy<any>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController({ data: 'fake_password' });
      modalControllerSpy = fakeModalController.createSpy();
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      productSpy = jasmine.createSpyObj('InvestmentProduct', {
        token: { value: 'USDC' },
        contractAddress: '0xtest',
        name: 'testInvestmentProductName',
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
        getEncryptedWallet: Promise.resolve({ addresses: { MATIC: '0x0000001' } }),
      });
      providerSpy = jasmine.createSpyObj(
        'Provider',
        { getGasPrice: Promise.resolve(BigNumber.from('10')) },
        {
          _isProvider: true,
        }
      );
      erc20ProviderSpy = jasmine.createSpyObj('ERC20Provider', {
        value: providerSpy,
        coin: { contract: '0x000000001', abi: [] },
      });
      investmentSpy = jasmine.createSpyObj('Investment', {
        deposit: Promise.resolve({ wait: () => Promise.resolve() }),
      });
      toastServiceSpy = jasmine.createSpyObj('ToastService', {
        showErrorToast: Promise.resolve(),
        showWarningToast: Promise.resolve(),
      });
      dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(4000) });
      erc20ContractSpy = jasmine.createSpyObj('ERC20Contract', {
        value: { estimateGas: { approve: () => Promise.resolve(BigNumber.from('15')) } },
      });
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getPrices: of({ prices: { ETH: 4000 } }),
        getCoins: [],
        getCoinsFromNetwork: [{ native: true, value: 'MATIC' }],
      });
      walletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', { balanceOf: Promise.resolve('51') });

      storageSpy = jasmine.createSpyObj('IonicStorageService', {
        set: Promise.resolve(),
        get: Promise.resolve(true),
      });

      browserServiceSpy = jasmine.createSpyObj('BrowserService', {
        open: Promise.resolve(),
      });

      fakeActivatedRoute = new FakeActivatedRoute({ mode: 'invest' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      TestBed.configureTestingModule({
        declarations: [InvestmentConfirmationPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: InvestmentDataService, useValue: investmentDataServiceSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ToastService, useValue: toastServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: WalletBalanceService, useValue: walletBalanceServiceSpy },
          { provide: IonicStorageService, useValue: storageSpy },
          { provide: BrowserService, useValue: browserServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(InvestmentConfirmationPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      createDynamicPriceSpy = spyOn(component, 'createDynamicPrice').and.returnValue(dynamicPriceSpy);
      createErc20ProviderSpy = spyOn(component, 'createErc20Provider').and.returnValue(erc20ProviderSpy);
      approveFeeContractSpy = spyOn(component, 'approveFeeContract').and.returnValue(Promise.resolve(erc20ContractSpy));
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
    fixture.debugElement.query(By.css('ion-button[name="ux_invest_confirm"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(investmentSpy.deposit).toHaveBeenCalledTimes(1);
    expect(storageSpy.set).toHaveBeenCalledOnceWith('_agreement_2PI_T&C', true);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/defi/success-investment', 'invest']);
  });

  it('should not make deposit when password is valid but deposit fails', async () => {
    investmentSpy.deposit.and.returnValue(Promise.reject());
    spyOn(component, 'investment').and.returnValue(investmentSpy);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_invest_confirm"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(investmentSpy.deposit).toHaveBeenCalledTimes(1);
    expect(storageSpy.set).not.toHaveBeenCalled();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      '/defi/error-investment',
      'testInvestmentProductName',
    ]);
  });

  it('should not make deposit when modal closes', async () => {
    fakeModalController.modifyReturns({ data: undefined }, {});
    await component.ionViewDidEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_invest_confirm"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(walletEncryptionServiceSpy.getDecryptedWalletForCurrency).not.toHaveBeenCalled();
    expect(investmentSpy.deposit).not.toHaveBeenCalled();
  });

  it('should not make deposit when password is not valid', async () => {
    walletEncryptionServiceSpy.getDecryptedWalletForCurrency.and.rejectWith();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_invest_confirm"]')).nativeElement.click();
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

  it('should erc20 provider', async () => {
    await component.ionViewDidEnter();
    createErc20ProviderSpy.and.callThrough();
    expect(component.createErc20Provider()).toBeTruthy();
  });

  it('should create approve fee contract spy', async () => {
    await component.ionViewDidEnter();
    approveFeeContractSpy.and.callThrough();
    expect(await component.approveFeeContract()).toBeTruthy();
  });

  it('should unsubscribe when leave', () => {
    const nextSpy = spyOn(component.leave$, 'next');
    const completeSpy = spyOn(component.leave$, 'complete');
    component.ionViewWillLeave();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should show informative modal when password is valid but the available balance is lower than the set value ', async () => {
    walletBalanceServiceSpy.balanceOf.and.returnValue(Promise.resolve(49));
    await component.ionViewDidEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_invest_confirm"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(toastServiceSpy.showWarningToast).toHaveBeenCalledTimes(1);
  });

  it('should not show informative modal of fees and button enable on view did enter when the native token balance is bigger than the cost of fees', async () => {
    walletBalanceServiceSpy.balanceOf.and.returnValue(Promise.resolve(0.001));
    providerSpy.getGasPrice.and.returnValue(Promise.resolve(BigNumber.from('100000')));
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(toastServiceSpy.showWarningToast).toHaveBeenCalledTimes(0);
    expect(component.disable).toBeFalsy();
  });

  it('should show informative modal of fees and button disable on view did enter when the native token balance is lower than the cost of fees', async () => {
    walletBalanceServiceSpy.balanceOf.and.returnValue(Promise.resolve(0.001));
    providerSpy.getGasPrice.and.returnValue(Promise.resolve(BigNumber.from('1000000000')));
    fixture.detectChanges();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(component.disable).toBeTruthy();
  });

  it('should check agreements automatically when 2PI T&C agreement exists on cache', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_invest_confirm"]'));
    expect(component.form.valid).toBeTrue();
    expect(buttonEl.attributes['ng-reflect-disabled']).toEqual('false');
  });

  it('should show empty agreement checkboxes when investing for first time', async () => {
    storageSpy.get.and.resolveTo(false);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_invest_confirm"]'));
    expect(component.form.valid).toBeFalse();
    expect(buttonEl.attributes['ng-reflect-disabled']).toEqual('true');
  });

  it('should open 2PI T&C when T&C link is clicked', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-label.checkbox-link > ion-text:last-child')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: LINKS.twoPiTermsAndConditions });
  });

  it('should render the correct text according to mode "invest"', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    const headerEl = fixture.debugElement.query(By.css('.ion-text-center'));
    const labelEl = fixture.debugElement.query(By.css('.summary__amount__label ion-text'));
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(headerEl.nativeElement.innerHTML).toContain('defi_investments.confirmation.header');
    expect(labelEl.nativeElement.innerHTML).toContain('defi_investments.confirmation.amount_to_invest');
  });

  it('should render the correct text according to mode "add"', async () => {
    fakeActivatedRoute.modifySnapshotParams({ mode: 'add' });
    await component.ionViewDidEnter();
    fixture.detectChanges();
    const headerEl = fixture.debugElement.query(By.css('.ion-text-center'));
    const labelEl = fixture.debugElement.query(By.css('.summary__amount__label ion-text'));
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(headerEl.nativeElement.innerHTML).toContain('defi_investments.add.header');
    expect(labelEl.nativeElement.innerHTML).toContain('defi_investments.add.amount_to_add');
  });
});
