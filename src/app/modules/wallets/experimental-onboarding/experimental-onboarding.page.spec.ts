import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { TokenOperationData } from '../../fiat-ramps/shared-ramps/interfaces/token-operation-data.interface';
import { TokenOperationDataService } from '../../fiat-ramps/shared-ramps/services/token-operation-data/token-operation-data.service';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { ExperimentalOnboardingPage } from './experimental-onboarding.page';

describe('ExperimentalOnboardingPage', () => {
  let component: ExperimentalOnboardingPage;
  let fixture: ComponentFixture<ExperimentalOnboardingPage>;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let operationData: TokenOperationData;
  const anERC20Address = '0x0123456789101112131415';

  beforeEach(waitForAsync(() => {
    operationData = { asset: 'USDC', network: 'MATIC', country: undefined };
    fakeWalletService = new FakeWalletService(true, {}, { ERC20: anERC20Address });
    walletServiceSpy = fakeWalletService.createSpy();

    tokenOperationDataServiceSpy = jasmine.createSpyObj('TokenOperationDataService', {
      tokenOperationData: {},
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    TestBed.configureTestingModule({
      declarations: [ExperimentalOnboardingPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperimentalOnboardingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly app-initiation-wallet-step-card component', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const [component1El, component2El] = fixture.debugElement.queryAll(By.css('app-initiation-wallet-step-card'));
    expect(component1El).toBeTruthy();
    expect(component2El).toBeTruthy();
  });

  it('should set username on enter', async () => {
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(walletServiceSpy.walletExist).toHaveBeenCalledTimes(1);
    expect(component.username).toEqual('Xcapiter0x012');
  });

  it('should set Token operation Data and navigate to select provider when event is emitted', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const contentEl = fixture.debugElement.query(By.css('app-initiation-wallet-step-card'));
    contentEl.triggerEventHandler('navigate', { name: 'ux_exp_buy', url: '/fiat-ramps/select-provider' });
    fixture.detectChanges();
    expect(tokenOperationDataServiceSpy.tokenOperationData).toEqual(operationData);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/select-provider');
  });

  it('should navigate to home wallet when close button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Close Success"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('tabs/wallets');
  });

  it('should navigate to deposit when event is emitted', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const [content1El, content2El] = fixture.debugElement.queryAll(By.css('app-initiation-wallet-step-card'));
    content2El.triggerEventHandler('navigate', {
      name: 'ux_exp_deposit',
      url: '/wallets/receive/detail?asset=USDC&network=MATIC',
    });
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(
      '/wallets/receive/detail?asset=USDC&network=MATIC'
    );
  });
});
