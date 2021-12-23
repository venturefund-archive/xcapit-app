import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { SelectCoinsWalletPage } from './select-coins-wallet.page';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { ItemCoinComponent } from '../shared-wallets/components/item-coin/item-coin.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { FakeLoadingService } from '../../../../testing/fakes/loading.fake.spec';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { WalletMaintenanceService } from '../shared-wallets/services/wallet-maintenance/wallet-maintenance.service';

const testSelectedTokens = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    native: true,
  },
  {
    id: 3,
    name: 'USDT - Tether',
    logoRoute: 'assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.text/',
    contract: '0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD',
    decimals: 6,
  },
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.text/',
    native: true,
  },
  {
    id: 7,
    name: 'RIF - Rifos',
    logoRoute: 'assets/img/coins/RIF.png',
    last: false,
    value: 'RIF',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.text/',
    contract: '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE',
    decimals: 18,
  },
  {
    id: 8,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.png',
    last: false,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 80001,
    rpc: 'http://testrpc.text/',
    decimals: 18,
    native: true,
  },
];

const testERC20Coins: Coin[] = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    native: true,
  },
  {
    id: 2,
    name: 'LINK - Chainlink',
    logoRoute: 'assets/img/coins/LINK.png',
    last: false,
    value: 'LINK',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    contract: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
    decimals: 18,
  },
  {
    id: 3,
    name: 'USDT - Tether',
    logoRoute: 'assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.text/',
    contract: '0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD',
    decimals: 6,
  },
  {
    id: 5,
    name: 'UNI - Uniswap',
    logoRoute: 'assets/img/coins/UNI.svg',
    last: false,
    value: 'UNI',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.text/',
    contract: '0xf2e3c830C6220795C6e101492BD1b98fb122AC01',
    decimals: 18,
  },
];

const testRSKCoins: Coin[] = [
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.text/',
    native: true,
  },
  {
    id: 7,
    name: 'RIF - Rifos',
    logoRoute: 'assets/img/coins/RIF.png',
    last: false,
    value: 'RIF',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.text/',
    contract: '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE',
    decimals: 18,
  },
  {
    id: 9,
    name: 'SOV - Sovryn',
    logoRoute: 'assets/img/coins/SOV.png',
    last: true,
    value: 'SOV',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.text/',
    contract: '0x6a9A07972D07e58F0daf5122d11E069288A375fb',
    decimals: 18,
  },
];

const testMATICCoins: Coin[] = [
  {
    id: 8,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.png',
    last: false,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 80001,
    rpc: 'http://testrpc.text/',
    decimals: 18,
    native: true,
  },
];

const testBSC_BEP20Coins: Coin[] = [
  {
    id: 10,
    name: 'BNB - Binance Coin',
    logoRoute: 'assets/img/coins/BNB.svg',
    last: true,
    value: 'BNB',
    network: 'BSC_BEP20',
    chainId: 97,
    rpc: 'http://testrpc.text/',
    decimals: 18,
    native: true,
  },
];

const testCoins: Coin[] = [...testERC20Coins, ...testRSKCoins, ...testBSC_BEP20Coins, ...testMATICCoins];

const formData = {
  valid: {
    ERC20: {
      ETH: true,
      UNI: true,
      LINK: false,
      USDT: false,
    },
    MATIC: {
      MATIC: false,
    },
    RSK: {
      RBTC: false,
      RIF: false,
      SOV: false,
    },
    BSC_BEP20: {
      BNB: false,
    },
  },
  invalid: {
    ERC20: {
      ETH: false,
      UNI: false,
      USDT: false,
      LINK: false,
    },
    MATIC: {
      MATIC: false,
    },
    RSK: {
      RBTC: false,
      RIF: false,
      SOV: false,
    },
    BSC_BEP20: {
      BNB: false,
    },
  },
  editTokensOriginal: {
    ERC20: {
      ETH: true,
      UNI: false,
      USDT: true,
      LINK: false,
    },
    MATIC: {
      MATIC: true,
    },
    RSK: {
      RBTC: true,
      RIF: true,
      SOV: false,
    },
    BSC_BEP20: {
      BNB: false,
    },
  },
  startForm: {
    ERC20: {
      ETH: false,
      LINK: false,
      UNI: false,
      USDT: false,
    },
    MATIC: {
      MATIC: false,
    },
    RSK: {
      RBTC: false,
      RIF: false,
      SOV: false,
    },
    BSC_BEP20: {
      BNB: false,
    },
  },
};

const testSuites = {
  ERC20: testERC20Coins,
  MATIC: testMATICCoins,
  RSK: testRSKCoins,
  BSC_BEP20: testBSC_BEP20Coins,
};

// TODO: Check coverage to see if there are missing tests
fdescribe('SelectCoinsWalletPage', () => {
  let component: SelectCoinsWalletPage;
  let fixture: ComponentFixture<SelectCoinsWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SelectCoinsWalletPage>;
  let activatedRouteSpy: any;
  let navControllerSpy: any;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let fakeNavController: FakeNavController;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletMaintenanceServiceSpy: jasmine.SpyObj<WalletMaintenanceService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let fakeLoadingService: FakeLoadingService;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      fakeModalController.modifyReturns(null, { data: 'testPassword' });

      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      fakeLoadingService = new FakeLoadingService();
      loadingServiceSpy = fakeLoadingService.createSpy();

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoins: testCoins,
        getNetworks: ['ERC20', 'RSK', 'MATIC', 'BSC_BEP20'],
        getCoinsFromNetwork: undefined,
        getCoin: testCoins[0],
      });
      apiWalletServiceSpy.getCoinsFromNetwork.and.callFake((network) => testSuites[network]);

      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);

      walletServiceSpy = jasmine.createSpyObj(
        'WalletService',
        {
          create: Promise.resolve({}),
        },
        { coins: [] }
      );

      walletMaintenanceServiceSpy = jasmine.createSpyObj('WalletMaintenanceService', {
        getUserAssets: Promise.resolve(testSelectedTokens),
        isUpdated: true,
        toggleAssets: undefined,
        saveWalletToStorage: Promise.resolve(),
        updateWalletNetworks: Promise.resolve(),
      });
      TestBed.configureTestingModule({
        declarations: [SelectCoinsWalletPage, FakeTrackClickDirective, ItemCoinComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule, ReactiveFormsModule],
        providers: [
          TrackClickDirective,
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: WalletMaintenanceService, useValue: walletMaintenanceServiceSpy },
          { provide: LoadingService, useValue: loadingServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCoinsWalletPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Next Button clicked', () => {
    component.userCoinsLoaded = true;
    component.createForm();
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Next');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not activate the Next button when no token is selected', async () => {
    component.userCoinsLoaded = true;
    component.txInProgress = false;
    component.createForm();
    fixture.detectChanges();
    component.form.patchValue(formData.startForm);
    await fixture.whenStable();
    fixture.detectChanges();
    const nextButton = fixture.debugElement.query(By.css('ion-button[name="Next"]'));
    expect(nextButton.attributes['ng-reflect-disabled']).toEqual('true');
  });

  it('should activate the Next button when at least one token is selected', async () => {
    component.userCoinsLoaded = true;
    component.txInProgress = false;
    component.createForm();
    fixture.detectChanges();
    component.form.patchValue(formData.valid);
    await fixture.whenStable();
    fixture.detectChanges();
    const nextButton = fixture.debugElement.query(By.css('ion-button[name="Next"]'));
    expect(nextButton.attributes['ng-reflect-disabled']).toEqual('false');
  });

  [
    {
      mode: {
        text: 'Create',
        value: '',
      },
      onSubmit: {
        navigateTo: {
          route: ['/wallets/create-first/recovery-phrase'],
          pageName: 'Recovery Phrase page',
        },
        originalFormData: undefined,
      },
      changeTexts: {
        header: 'wallets.select_coin.header',
        submitButton: ' deposit_addresses.deposit_currency.next_button ',
      },
    },
    {
      mode: {
        text: 'Import',
        value: 'import',
      },
      onSubmit: {
        navigateTo: {
          route: ['/wallets/create-password', 'import'],
          pageName: 'Create Password page',
        },
        originalFormData: undefined,
      },
      changeTexts: {
        header: 'wallets.recovery_wallet.header',
        submitButton: ' deposit_addresses.deposit_currency.next_button ',
      },
    },
    {
      mode: {
        text: 'Edit',
        value: 'edit',
      },
      onSubmit: {
        navigateTo: {
          route: ['/tabs/wallets'],
          pageName: 'Wallet Home page',
        },
        originalFormData: formData.editTokensOriginal,
      },
      changeTexts: {
        header: 'wallets.select_coin.header_edit',
        submitButton: ' wallets.select_coin.submit_edit ',
      },
      requiresUpdate: [
        {
          isUpdated: false,
          text: 'Wallet requires update',
          editTokens: {
            text: 'call updateWalletNetworks and not call toggleAssets',
            callsToToggleAssets: 0,
            callsToUpdateWalletNetworks: 1,
          },
        },
        {
          isUpdated: true,
          text: 'Wallet is updated',
          editTokens: {
            text: 'call toggleAssets and not call updateWalletNetworks',
            callsToToggleAssets: 1,
            callsToUpdateWalletNetworks: 0,
          },
        },
      ],
    },
  ].forEach((testCase) => {
    describe(`${testCase.mode.text} Mode`, () => {
      beforeEach(() => {
        activatedRouteSpy.snapshot = {
          paramMap: convertToParamMap({
            mode: testCase.mode.value,
          }),
        };
        component.mode = testCase.mode.value;
      });

      it('should set mode on ionViewWillEnter when mode exists', () => {
        component.ionViewWillEnter();
        expect(component.mode).toEqual(testCase.mode.value);
      });

      it('should set coins in wallet service on handleSubmit and valid form', () => {
        component.almostOneChecked = true;
        component.userCoinsLoaded = true;
        spyOn(component, 'editTokens').and.returnValue(Promise.resolve());
        spyOn(component, 'importWallet').and.returnValue(undefined);
        spyOn(component, 'createWallet').and.returnValue(undefined);
        component.createForm();
        component.form.patchValue(formData.valid);
        fixture.detectChanges();
        fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
        expect(walletServiceSpy.coins.length).toEqual(2);
      });

      it('should change texts on header and Submit button', async () => {
        component.ionViewWillEnter();
        await fixture.whenStable();
        fixture.detectChanges();
        const buttonText = fixture.debugElement.query(By.css('ion-button[name="Next"]')).properties.innerHTML;
        const headerText = fixture.debugElement.query(By.css('ion-title')).properties.innerHTML;
        expect(buttonText).toEqual(testCase.changeTexts.submitButton);
        expect(headerText).toEqual(testCase.changeTexts.header);
      });

      it(`should get tokens from wallet on ionViewWillEnter`, async () => {
        component.ionViewWillEnter();
        await fixture.whenStable();
        fixture.detectChanges();
        if (testCase.mode.value === 'edit') {
          expect(component.form.value).toEqual(formData.editTokensOriginal);
        } else {
          expect(component.form.value).toEqual(formData.startForm);
        }
        expect(component.userCoinsLoaded).toBeTrue();
      });

      if (testCase.mode.value === 'edit') {
        testCase.requiresUpdate.forEach((testCaseEdit) => {
          describe(testCaseEdit.text, () => {
            beforeEach(() => {
              walletMaintenanceServiceSpy.isUpdated.and.returnValue(testCaseEdit.isUpdated);
              component.almostOneChecked = true;
              component.userCoinsLoaded = true;
              component.createForm();
              component.form.patchValue(formData.valid);
              component.originalFormData = testCase.onSubmit.originalFormData;
              fixture.detectChanges();
            });

            it(`should show loader, ${testCase.mode.text.toLowerCase()} wallet and navigate to ${
              testCase.onSubmit.navigateTo.pageName
            } on form submit`, fakeAsync(() => {
              fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
              fixture.detectChanges();
              tick();
              expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(testCase.onSubmit.navigateTo.route);
              expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
              expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
            }));

            it('should save wallet in storage on form submit', fakeAsync(() => {
              fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
              fixture.detectChanges();
              tick();
              expect(walletMaintenanceServiceSpy.saveWalletToStorage).toHaveBeenCalledTimes(1);
            }));

            it(`should ${testCaseEdit.editTokens.text} on form submit`, fakeAsync(() => {
              fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
              fixture.detectChanges();
              tick();
              expect(walletMaintenanceServiceSpy.toggleAssets).toHaveBeenCalledTimes(
                testCaseEdit.editTokens.callsToToggleAssets
              );
              expect(walletMaintenanceServiceSpy.updateWalletNetworks).toHaveBeenCalledTimes(
                testCaseEdit.editTokens.callsToUpdateWalletNetworks
              );
            }));

            if (!testCaseEdit.isUpdated) {
              it('should ask user for password on form submit', fakeAsync(() => {
                fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
                fixture.detectChanges();
                tick();
                expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
                expect(walletMaintenanceServiceSpy.password).toEqual('testPassword');
              }));
            }
          });
        });
      } else {
        it(`should show loader, ${testCase.mode.text.toLowerCase()} wallet and navigate to ${
          testCase.onSubmit.navigateTo.pageName
        } on form submit`, fakeAsync(() => {
          component.almostOneChecked = true;
          component.userCoinsLoaded = true;
          component.createForm();
          component.form.patchValue(formData.valid);
          component.originalFormData = testCase.onSubmit.originalFormData;
          fixture.detectChanges();
          fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
          fixture.detectChanges();
          tick();
          expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(testCase.onSubmit.navigateTo.route);
          if (testCase.mode.value === 'import') {
            expect(walletServiceSpy.create).toHaveBeenCalledTimes(1);
            expect(loadingServiceSpy.showModal).toHaveBeenCalledTimes(1);
            expect(loadingServiceSpy.dismissModal).toHaveBeenCalledTimes(1);
          }
        }));

        it(`should not show loader, not ${testCase.mode.text.toLowerCase()} wallet and not navigate to ${
          testCase.onSubmit.navigateTo.pageName
        } on invalid form submit`, fakeAsync(() => {
          component.almostOneChecked = false;
          component.userCoinsLoaded = true;
          component.createForm();
          fixture.detectChanges();
          fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
          fixture.detectChanges();
          tick();
          expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
          if (testCase.mode.value === 'import') {
            expect(walletServiceSpy.create).toHaveBeenCalledTimes(0);
            expect(loadingServiceSpy.showModal).toHaveBeenCalledTimes(0);
            expect(loadingServiceSpy.dismissModal).toHaveBeenCalledTimes(0);
          }
        }));
      }
    });
  });

  // it('should create form dinamically on ionViewWillEnter', () => {

  // });
});
