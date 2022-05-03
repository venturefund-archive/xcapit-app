import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { DefiInvestmentProductsPage } from './defi-investment-products.page';
import { TwoPiInvestment } from '../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { WalletEncryptionService } from '../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { AvailableDefiProducts } from '../shared-defi-investments/models/available-defi-products/available-defi-products.model';
import { DefiProduct } from '../shared-defi-investments/interfaces/defi-product.interface';
import { TwoPiProduct } from '../shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { InvestmentProduct } from '../shared-defi-investments/interfaces/investment-product.interface';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

const testCoins = [
  jasmine.createSpyObj(
    {},
    {
      name: 'USDC - USD Coin',
      value: 'USDC',
      network: 'MATIC',
      decimals: 6,
    }
  ),
];


describe('DefiInvestmentProductsPage', () => {
  let component: DefiInvestmentProductsPage;
  let fixture: ComponentFixture<DefiInvestmentProductsPage>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let investmentSpy: jasmine.SpyObj<TwoPiInvestment>;
  let availableDefiProductsSpy: jasmine.SpyObj<AvailableDefiProducts>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let investmentProductSpy: jasmine.SpyObj<InvestmentProduct>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiUsuariosServiceSpy: jasmine.SpyObj<ApiUsuariosService>;
  let testUserSpy: jasmine.SpyObj<any>;
  let testUserWithTestSpy: jasmine.SpyObj<any>;
  let testAggressiveUserSpy: jasmine.SpyObj<any>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DefiInvestmentProductsPage>;
  beforeEach(
    waitForAsync(() => {
      testUserSpy = jasmine.createSpyObj('testUser', {},{
        profile: {
          investor_category: 'wealth_managements.profiles.no_category',
        },
      })

      testUserWithTestSpy = jasmine.createSpyObj('testUser', {},{
        profile: {
          investor_category: 'wealth_managements.profiles.conservative',
        },
      })

      testAggressiveUserSpy = jasmine.createSpyObj('testUser', {},{
        profile: {
          investor_category: 'wealth_managements.profiles.aggressive',
        },
      })

      
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();

      apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', { getUser: of(testUserWithTestSpy) });

      walletServiceSpy = jasmine.createSpyObj('WalletServiceSpy',{
        walletExist: Promise.resolve(true),
      })
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
        getCoins: testCoins,
      });
      walletEncryptionServiceSpy = jasmine.createSpyObj(
        'WalletEncryptionServiceSpy',
        {
          getEncryptedWallet: Promise.resolve({ addresses: { MATIC: '0x0000001' } }),
        },
        {
          addresses: { MATIC: '0x0000001' },
        }
      );

      investmentSpy = jasmine.createSpyObj('TwoPiInvestment', {
        balance: Promise.resolve(50),
      });

      investmentProductSpy = jasmine.createSpyObj('InvestmentProduct', {
        token: testCoins[0],
        contractAddress: '0x00001',
      });

      availableDefiProductsSpy = jasmine.createSpyObj('AvailableDefiProducts', {
        value: [{ id: 'mumbai_usdc', isComing: false, category:'conservative' }],
      });

      TestBed.configureTestingModule({
        declarations: [DefiInvestmentProductsPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, ReactiveFormsModule,],
        providers: [
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(DefiInvestmentProductsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty div when no filtered products are available', async () => {
    investmentSpy.balance.and.resolveTo(0);
    apiUsuariosServiceSpy.getUser.and.returnValue(of(testAggressiveUserSpy));
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(
      availableDefiProductsSpy
    );
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const emptyEl = fixture.debugElement.query(
      By.css('div.dp__empty ')
    );
    expect(emptyEl).toBeTruthy();
  });

  it('should render active investment card', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(
      availableDefiProductsSpy
    );
    component.ionViewDidLeave();
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const activeEl = fixture.debugElement.query(
      By.css('div.dp__active-card > ion-item > ion-label')
    );
    expect(activeEl.nativeElement.innerHTML).toContain(
      'defi_investments.defi_investment_products.title_investments'
    );

    const balanceEl = fixture.debugElement.query(By.css('app-investment-balance-item'));
    expect(balanceEl).toBeTruthy();
  });

  it('should render available investment card', async () => {
    investmentSpy.balance.and.resolveTo(0);
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(
      availableDefiProductsSpy
    );
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const availableEl = fixture.debugElement.query(
      By.css('div.dp__available-card > ion-item > ion-label')
    );
    expect(availableEl.nativeElement.innerHTML).toContain(
      'defi_investments.defi_investment_products.title'
    );
    const productEl = fixture.debugElement.query(By.css('app-defi-investment-product'));
    expect(productEl).toBeTruthy();
  });

  it('should render available investment card when dont have wallet', async () => {
    walletServiceSpy.walletExist.and.resolveTo(false);
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(
      availableDefiProductsSpy 
    );
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenRenderingDone();

    const availableEl = fixture.debugElement.query(
      By.css('div.dp__available-card > ion-item > ion-label')
    );
    expect(availableEl.nativeElement.innerHTML).toContain(
      'defi_investments.defi_investment_products.title'
    );
    const productEl = fixture.debugElement.query(By.css('app-defi-investment-product'));
    expect(productEl).toBeTruthy();
  });

  it('should render filter tab component', async () => {
    investmentSpy.balance.and.resolveTo(0);
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(
      availableDefiProductsSpy
    );
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const productEl = fixture.debugElement.query(By.css('app-filter-tab'));
    expect(productEl).toBeTruthy();
  });

  it('should set conservative filter when user didnt do test yet ', async () => {
    apiUsuariosServiceSpy.getUser.and.returnValue(of(testUserSpy));
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(
      availableDefiProductsSpy
    );
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(component.profileForm.value.profile).toEqual('conservative');
  });

  it('should call trackEvent on trackService when go_to_defi_faqs Button clicked', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(
      availableDefiProductsSpy
    );
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'go_to_defi_faqs');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to deFi Faqs when go_to_defi_faqs button is clicked', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(
      availableDefiProductsSpy
    );
    component.ionViewWillEnter();
    await component.ionViewDidEnter();

    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="go_to_defi_faqs"'));
    buttonEl.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/support/defi']);
  });

  it('should render header skeleton when active or available products are not yet loaded yet.', async () => {
    availableDefiProductsSpy.value.and.returnValue([]);
    expect(fixture.debugElement.query(By.css('.skeleton'))).toBeTruthy();
  });
  
  it('should render defi-product skeleton when active or available products are not loaded yet.', async () => {
    availableDefiProductsSpy.value.and.returnValue([]);
    expect(fixture.debugElement.query(By.css('app-defi-investment-product-skeleton'))).toBeTruthy();
  });

    
  it('should render choose investor skeleton when active or available products are not loaded yet.', async () => {
    availableDefiProductsSpy.value.and.returnValue([]);
    expect(fixture.debugElement.query(By.css('app-choose-investor-profile-skeleton'))).toBeTruthy();
  });

  it('should create available defi products', () => {
    expect(component.createAvailableDefiProducts()).toBeInstanceOf(AvailableDefiProducts);
  });

  it('should create investment product', async () => {
    expect(await component.getInvestmentProduct({} as DefiProduct)).toBeInstanceOf(
      TwoPiProduct
    );
  });

  it('should create investment', async () => {
    expect(await component.createInvestment(investmentProductSpy, '0x')).toBeInstanceOf(
      TwoPiInvestment
    );
  });

  it('should get user investor score on ionViewWillEnter', async () => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    expect(apiUsuariosServiceSpy.getUser).toHaveBeenCalledTimes(1);
  });

  it('should render investor test card when user did the investor test', async () => {
    walletServiceSpy.walletExist.and.resolveTo(false);
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(
      availableDefiProductsSpy
    );
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const cardEl = fixture.debugElement.query(By.css('app-choose-investor-profile-card'));
    expect(cardEl.nativeElement.hasDoneInvestorTest).toBeTrue();   
    expect(cardEl).toBeTruthy();
  });

  it('should render investor test card when user did not take the investor test', async () => {
    apiUsuariosServiceSpy.getUser.and.returnValue(of(testUserSpy));
    walletServiceSpy.walletExist.and.resolveTo(false);
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(
      availableDefiProductsSpy
    );
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const cardEl = fixture.debugElement.query(By.css('app-choose-investor-profile-card'));
    expect(cardEl.nativeElement.hasDoneInvestorTest).toBeFalse();   
    expect(cardEl).toBeTruthy();
  });
});
