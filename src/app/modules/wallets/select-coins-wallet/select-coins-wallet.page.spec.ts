import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
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
import {
  TEST_BSC_BEP20_COINS,
  TEST_COINS,
  TEST_ERC20_COINS,
  TEST_MATIC_COINS,
  TEST_RSK_COINS,
} from '../shared-wallets/constants/coins.test';
import { SELECT_COINS_FORM_DATA } from './form-data.spec';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

const modeTestsData = [
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
    },
    changeTexts: {
      header: 'wallets.select_coin.header_edit',
      submitButton: ' wallets.select_coin.submit_edit ',
    },
  },
];

const walletUpdateTestData = [
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
];

const testDynamicFormValue = {
  test: {
    TNC: false,
    TC: false,
  },
};

const testCoinsForDynamicForm: Coin[] = [
  {
    id: 1,
    name: 'TNC - Test Native Coin',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'TNC',
    network: 'test',
    chainId: 400,
    rpc: 'http://testrpc.test/',
    native: true,
  },
  {
    id: 2,
    name: 'TC - Test Coin',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'TC',
    network: 'test',
    chainId: 400,
    rpc: 'http://testrpc.test/',
  },
];

const testSelectedTokens = [TEST_COINS[0], TEST_COINS[2], TEST_COINS[4], TEST_COINS[5], TEST_COINS[7]];

const formData = SELECT_COINS_FORM_DATA;

const testSuites = {
  ERC20: TEST_ERC20_COINS,
  MATIC: TEST_MATIC_COINS,
  RSK: TEST_RSK_COINS,
  BSC_BEP20: TEST_BSC_BEP20_COINS,
};

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
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(
    waitForAsync(() => {
      toastServiceSpy = jasmine.createSpyObj('ToastService', {
        showErrorToast: Promise.resolve(),
      });

      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      fakeModalController.modifyReturns(null, { data: 'testPassword' });

      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      fakeLoadingService = new FakeLoadingService();
      loadingServiceSpy = fakeLoadingService.createSpy();

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoins: TEST_COINS,
        getNetworks: ['ERC20', 'RSK', 'MATIC', 'BSC_BEP20'],
        getCoinsFromNetwork: undefined,
        getCoin: TEST_COINS[0],
      });
      apiWalletServiceSpy.getCoinsFromNetwork.and.callFake((network) => testSuites[network]);

      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);

      walletServiceSpy = jasmine.createSpyObj(
        'WalletService',
        {
          create: Promise.resolve({}),
          selectedCoins: false,
        },
        { coins: JSON.parse(JSON.stringify(testSelectedTokens)) }
      );

      walletMaintenanceServiceSpy = jasmine.createSpyObj(
        'WalletMaintenanceService',
        {
          getUserAssets: Promise.resolve(testSelectedTokens),
          isUpdated: true,
          toggleAssets: undefined,
          saveWalletToStorage: Promise.resolve(),
          updateWalletNetworks: Promise.resolve(),
        },
        {
          password: 'testPassword',
        }
      );
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
          { provide: ToastService, useValue: toastServiceSpy },
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
    component.txInProgress = true;
    component.createForm();
    fixture.detectChanges();
    component.form.patchValue(formData.invalid);
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

  it('should create form dinamically on ionViewWillEnter', () => {
    apiWalletServiceSpy.getNetworks.and.returnValue(['test']);
    apiWalletServiceSpy.getCoinsFromNetwork.and.returnValue(testCoinsForDynamicForm);
    component.createForm();
    expect(component.form.value).toEqual(testDynamicFormValue);
  });

  modeTestsData.forEach((testCase) => {
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
          expect(component.form.value).toEqual(formData.invalid);
        }
        expect(component.userCoinsLoaded).toBeTrue();
      });

      if (testCase.mode.value === 'edit') {
        it('should get user coins on ionViewWillEnter', async () => {
          component.ionViewWillEnter();
          await fixture.whenStable();
          expect(component.userCoinsLoaded).toBeTrue();
          expect(component.originalFormData).toEqual(formData.editTokensOriginal);
          expect(component.form.value).toEqual(formData.editTokensOriginal);
        });

        walletUpdateTestData.forEach((testCaseEdit) => {
          describe(testCaseEdit.text, () => {
            beforeEach(() => {
              walletMaintenanceServiceSpy.isUpdated.and.returnValue(testCaseEdit.isUpdated);
              component.almostOneChecked = true;
              component.userCoinsLoaded = true;
              component.createForm();
              component.originalFormData = Object.assign({}, component.form.value);
              component.originalFormData = formData.editTokensOriginal;
              component.form.patchValue(formData.editTokensOriginal);
              component.userCoinsLoaded = true;
              fixture.detectChanges();
            });

            it(`should show loader, ${testCase.mode.text.toLowerCase()} wallet and navigate to ${
              testCase.onSubmit.navigateTo.pageName
            } on form submit`, fakeAsync(() => {
              component.form.patchValue(formData.valid);
              fixture.detectChanges();
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

              it('should show toast if password is incorrect on form submit', fakeAsync(() => {
                const spy = spyOn(component, 'showInvalidPasswordToast');
                walletMaintenanceServiceSpy.updateWalletNetworks.and.throwError('invalid password');
                fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
                fixture.detectChanges();
                tick();
                expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
                expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledTimes(1);
              }));

              it('should restart edit process if password is incorrect', async () => {
                const spy = spyOn(component, 'editTokens');
                await component.showInvalidPasswordToast();
                expect(spy).toHaveBeenCalledTimes(1);
                expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
              });

              it('should cancel submit if user closed password modal on form submit', fakeAsync(() => {
                fakeModalController.modifyReturns(null, { data: undefined });
                (
                  Object.getOwnPropertyDescriptor(walletMaintenanceServiceSpy, 'password').get as jasmine.Spy
                ).and.returnValue(undefined);
                fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
                fixture.detectChanges();
                tick();
                expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
                expect(loadingServiceSpy.show).toHaveBeenCalledTimes(0);
                expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(0);
                expect(walletMaintenanceServiceSpy.updateWalletNetworks).toHaveBeenCalledTimes(0);
                expect(walletMaintenanceServiceSpy.saveWalletToStorage).toHaveBeenCalledTimes(0);
                expect(walletMaintenanceServiceSpy.password).toEqual(undefined);
              }));
            }
          });
        });
      } else {
        it('should set coins in wallet service on handleSubmit and valid form', () => {
          (Object.getOwnPropertyDescriptor(walletServiceSpy, 'coins').get as jasmine.Spy).and.returnValue([]);
          component.almostOneChecked = true;
          component.userCoinsLoaded = true;
          component.createForm();
          component.form.patchValue(formData.valid);
          fixture.detectChanges();
          fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
          expect(walletServiceSpy.coins.length).toEqual(3);
        });

        it(`should ${testCase.mode.text.toLowerCase()} wallet and navigate to ${
          testCase.onSubmit.navigateTo.pageName
        } on form submit`, fakeAsync(() => {
          component.almostOneChecked = true;
          component.userCoinsLoaded = true;
          component.createForm();
          component.form.patchValue(formData.valid);
          component.originalFormData = undefined;
          fixture.detectChanges();
          fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
          fixture.detectChanges();
          tick();
          expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(testCase.onSubmit.navigateTo.route);
          if (testCase.mode.value === 'import') {
            expect(walletServiceSpy.create).toHaveBeenCalledTimes(1);
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

  it('should set all values to true when Toggle All Coins clicked and all values are false', async () => {
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        mode: 'import',
      }),
    };
    component.ionViewWillEnter();
    component.form.patchValue(formData.invalid);
    component.setAllSelected();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-toggle[name="Toggle All Coins"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.form.value).toEqual(formData.allTrue);
  });

  it('should set all values to true when Toggle All Coins clicked and some values are true', async () => {
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        mode: 'import',
      }),
    };
    component.ionViewWillEnter();
    component.form.patchValue(formData.valid);
    component.setAllSelected();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-toggle[name="Toggle All Coins"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.form.value).toEqual(formData.allTrue);
  });

  it('should set all values to false when Toggle All Coins clicked and all values are true', async () => {
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        mode: 'import',
      }),
    };
    component.ionViewWillEnter();
    component.form.patchValue(formData.allTrue);
    component.setAllSelected();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-toggle[name="Toggle All Coins"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.form.value).toEqual(formData.invalid);
  });

  it('should change activate toggle when toggle changes and all values are true', async () => {
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        mode: 'import',
      }),
    };
    component.ionViewWillEnter();
    component.form.patchValue(formData.allTrue);
    fixture.detectChanges();
    fixture.debugElement.queryAll(By.css('app-items-coin-group'))[0].triggerEventHandler('changed', { detail: { checked: true, value: TEST_ERC20_COINS[0] } });
    fixture.detectChanges();
    await fixture.whenStable();
    const toggle = fixture.debugElement.query(By.css('ion-toggle[name="Toggle All Coins"]'));
    expect(toggle.nativeElement.checked).toBeTrue();
  })

  it('should change the toggle value when at least one element is not true', async () => {
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        mode: 'import',
      }),
    };
    component.ionViewWillEnter();
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    fixture.debugElement.queryAll(By.css('app-items-coin-group'))[0].triggerEventHandler('changed', { detail: { checked: true, value: TEST_ERC20_COINS[0] } });
    fixture.detectChanges();
    await fixture.whenStable();
    const toggle = fixture.debugElement.query(By.css('ion-toggle[name="Toggle All Coins"]'));
    expect(toggle.nativeElement.checked).toBeFalse();
  })
});
