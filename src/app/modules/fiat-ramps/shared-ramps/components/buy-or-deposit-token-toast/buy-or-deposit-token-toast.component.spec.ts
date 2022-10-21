import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed, waitForAsync, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationExtras } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { ToastWithButtonsComponent } from 'src/app/shared/components/toast-with-buttons/toast-with-buttons.component';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ProviderTokensOf } from '../../models/provider-tokens-of/provider-tokens-of';
import { ProvidersFactory } from '../../models/providers/factory/providers.factory';
import { TokenOperationDataService } from '../../services/token-operation-data/token-operation-data.service';
import { BuyOrDepositTokenToastComponent } from "./buy-or-deposit-token-toast.component";

describe('BuyOrDepositTokenToastComponent', () => {
  let component: BuyOrDepositTokenToastComponent;
  let fixture: ComponentFixture<BuyOrDepositTokenToastComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let tokenSpy: jasmine.SpyObj<Token>;
  let unavailableTokenSpy: jasmine.SpyObj<Token>;
  let coinSpy: jasmine.SpyObj<Coin>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      tokenSpy = jasmine.createSpyObj('Token', { symbol: 'USDC', json: { network: 'MATIC' }});
      unavailableTokenSpy = jasmine.createSpyObj('UnavailableToken', { symbol: 'WETH', json: { network: 'MATIC' }});
      coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'USDC', network: 'MATIC' });
      tokenOperationDataServiceSpy = jasmine.createSpyObj('TokenOperationDataService', {}, { tokenOperationData: undefined });
      spyOn(ProviderTokensOf.prototype, 'all').and.returnValue([coinSpy]);
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { getCoins: [] });
      providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', { create: [] });
      translateServiceSpy = jasmine.createSpyObj('TranslateService', { instant: 'test' });
      TestBed.configureTestingModule({
        declarations: [BuyOrDepositTokenToastComponent, ToastWithButtonsComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: ProvidersFactory, useValue: providersFactorySpy },
          { provide: TranslateService, useValue: translateServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(BuyOrDepositTokenToastComponent);
      component = fixture.componentInstance;
      component.token = tokenSpy;
      component.text = 'test';
      component.primaryButtonText = 'buy crypto';
      component.secondaryButtonText = 'deposit crypto';
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to receive page with selected token on goToDeposit', fakeAsync(() => {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: 'USDC',
        network: 'MATIC',
      },
    };
    fixture.debugElement.query(By.css('app-toast-with-buttons')).triggerEventHandler('secondaryActionEvent');
    tick();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/receive/detail'], navigationExtras);
  }));

  it('should go to select provider page with selected token on goToSelectProvider', fakeAsync(() => {
    const tokenOperationData = {
      asset: 'USDC',
      network: 'MATIC',
    };
    fixture.debugElement.query(By.css('app-toast-with-buttons')).triggerEventHandler('primaryActionEvent');
    tick();
    expect((Object.getOwnPropertyDescriptor(tokenOperationDataServiceSpy, 'tokenOperationData').set as jasmine.Spy)).toHaveBeenCalledOnceWith(tokenOperationData)
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/fiat-ramps/select-provider']);
  }));

  it('should hide buy button if token is not available for purchase', () => {
    component.token = unavailableTokenSpy;
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.primaryButtonText).toBeUndefined();
  });

  it('should show buy button if token is not available for purchase', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.primaryButtonText).toBeDefined();
  });

  it('should translate texts', () => {
    fixture.detectChanges();
    expect(translateServiceSpy.instant).toHaveBeenCalledTimes(3);
  });
});
