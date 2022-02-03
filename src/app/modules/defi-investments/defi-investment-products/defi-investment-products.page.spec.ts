import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
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
  beforeEach(
    waitForAsync(() => {
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
        value: [{ id: 'mumbai_usdc', isComing: false }],
      });

      TestBed.configureTestingModule({
        declarations: [DefiInvestmentProductsPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule],
        providers: [
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: WalletService, useValue: walletServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(DefiInvestmentProductsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render active investment card', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(
      availableDefiProductsSpy
    );
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

  it('should render available investment card when dont have wallet', async () => {
    walletServiceSpy.walletExist.and.resolveTo(false);
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(
      availableDefiProductsSpy
    );
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
});
