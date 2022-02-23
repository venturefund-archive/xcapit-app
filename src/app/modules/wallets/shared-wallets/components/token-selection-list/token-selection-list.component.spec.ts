import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TEST_ERC20_COINS, TEST_RSK_COINS } from '../../constants/coins.test';
import { SuitePipe } from '../../pipes/suite/suite.pipe';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { TokenSelectionListComponent } from './token-selection-list.component';

describe('TokenSelectionListComponent', () => {
  let component: TokenSelectionListComponent;
  let fixture: ComponentFixture<TokenSelectionListComponent>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;

  beforeEach(waitForAsync(() => {
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', 
      {
        getNetworks: ['ERC20'],
        getCoins: TEST_RSK_COINS
      }
    );
    TestBed.configureTestingModule({
      declarations: [ TokenSelectionListComponent, SuitePipe ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot() ],
      providers: [
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenSelectionListComponent);
    component = fixture.componentInstance;
    component.userCoins = TEST_ERC20_COINS;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user coins if no coins where provided', () => {
    component.userCoins = undefined;
    component.ngOnInit();
    expect(component.userCoins).toEqual(TEST_RSK_COINS);
  });

  it('should render a list of coins', () => {
    const listEl = fixture.debugElement.query(By.css('.tsl'));
    expect(listEl.nativeElement.innerText).toContain('ETH - Ethereum');
    expect(listEl.nativeElement.innerText).toContain('LINK - Chainlink');
    expect(listEl.nativeElement.innerText).toContain('USDT - Tether');
    expect(listEl.nativeElement.innerText).toContain('UNI - Uniswap');
  });

  it('should emit event when coin clicked', () => {
    const spy = spyOn(component.clickedCoin, 'emit');
    const allCoinsEl = fixture.debugElement.queryAll(By.css('.tsl__suite-container__suite__coin-container'));
    allCoinsEl.forEach((coinEl, i) => {
      coinEl.nativeElement.click();
      expect(spy).toHaveBeenCalledWith(TEST_ERC20_COINS[i]);
    });
  });
});
