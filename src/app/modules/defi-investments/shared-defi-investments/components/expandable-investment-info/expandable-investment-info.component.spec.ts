import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { ExpandableInvestmentInfoComponent } from './expandable-investment-info.component';
import { TwoPiProduct } from '../../models/two-pi-product/two-pi-product.model';
import { SplitStringPipe } from 'src/app/shared/pipes/split-string/split-string.pipe';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { AvailableDefiProducts } from '../../models/available-defi-products/available-defi-products.model';
const modeTestsData = [
  {
    mode: {
      text: 'defi_investments.shared.expandable_investment_info.product_info.wbtc',
      value: 'mumbai_btc',
    },
  },
  {
    mode: {
      text: 'defi_investments.shared.expandable_investment_info.product_info.usdc',
      value: 'mumbai_usdc',
    }
  },
  {
    mode: {
      text: 'defi_investments.shared.expandable_investment_info.product_info.dai',
      value: 'mumbai_dai',
    },
  },
];

const usdc_coin = {
  id: 8,
  name: 'USDC - USD Coin',
  logoRoute: 'assets/img/coins/USDC.png',
  last: false,
  value: 'USDC',
  network: 'MATIC',
  chainId: 80001,
  rpc: 'http://testrpc.text/',
  moonpayCode: 'usdc_polygon',
  decimals: 6,
  symbol: 'USDCUSDT',
};

describe('ExpandableInvestmentInfoComponent', () => {
  let component: ExpandableInvestmentInfoComponent;
  let fixture: ComponentFixture<ExpandableInvestmentInfoComponent>;
  let twoPiProductSpy: jasmine.SpyObj<TwoPiProduct>;
  let activatedRouteSpy: any;
  let availableDefiProductsSpy: jasmine.SpyObj<AvailableDefiProducts>;
  beforeEach(
    waitForAsync(() => {
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
      twoPiProductSpy = jasmine.createSpyObj('TwoPiProduct', {
        token: usdc_coin,
        tvl: 15800500,
        apy: 12.66,
        type: 'Vault',
        provider: '2PI',
      });
      availableDefiProductsSpy = jasmine.createSpyObj('AvailableDefiProducts', {
        value: [{ id: 'mumbai_usdc', isComing: false, category:'conservative' }],
      });
      TestBed.configureTestingModule({
        declarations: [ExpandableInvestmentInfoComponent, SplitStringPipe],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers:[ { provide: ActivatedRoute, useValue: activatedRouteSpy },]
      }).compileComponents();

      fixture = TestBed.createComponent(ExpandableInvestmentInfoComponent);
      component = fixture.componentInstance;
      component.investmentProduct = twoPiProductSpy;
      
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  modeTestsData.forEach((testCase) => {
    describe(`${testCase.mode.value} Mode`, () => {
      beforeEach(() => {
        activatedRouteSpy.snapshot = {
          paramMap: convertToParamMap({
            vault: testCase.mode.value,
          }),
        }
      }),
      
      it('should render properly info description', async () => {
        component.ngOnInit();
        fixture.detectChanges();
        await fixture.whenRenderingDone();
        await fixture.whenStable();
        const infoEl = fixture.debugElement.query(By.css('.eif__accordion__content__product_description ion-text'));
        expect(infoEl.nativeElement.innerHTML).toContain(testCase.mode.text);
      });
    
   });  
  }),

  it('should render properly', async () => {
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        vault: 'mumbai_usdc',
      }),
    }
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const tokenSymbolEl = fixture.debugElement.query(
      By.css('ion-text.eif__accordion__header__content__text__token-symbol')
    );
    const tokenNameEl = fixture.debugElement.query(
      By.css('ion-text.eif__accordion__header__content__text__token-name')
    );
    const apyEl = fixture.debugElement.query(By.css('ion-badge.ux-font-num-subtitulo'));
    const blockchainBadgeEl = fixture.debugElement.query(By.css('ion-badge.ux-badge'));
    console.log(blockchainBadgeEl)
    const [typeEl, depositAssetEl, withdrawAssetEl, providerEl, profileEl] = fixture.debugElement.queryAll(
      By.css(
        'ion-label.eif__accordion__content__information-item ion-text.eif__accordion__content__information-item__text'
      )
    );
    const [depositAssetImgEl, withdrawAssetImgEl] = fixture.debugElement.queryAll(
      By.css('ion-item.split-information-item div.inline-image>img')
    );
    expect(tokenSymbolEl.nativeElement.innerHTML).toEqual('USDC');
    expect(tokenNameEl.nativeElement.innerHTML).toEqual('USD Coin');
    expect(apyEl.nativeElement.innerHTML).toContain('12.66');
    // expect(tvlEl.nativeElement.innerHTML).toContain('$15,800,500.00');
    expect(typeEl.nativeElement.innerHTML).toContain('Vault');
    expect(depositAssetEl.nativeElement.innerHTML).toContain('USDC');
    expect(depositAssetImgEl.attributes.src).toEqual('assets/img/coins/USDC.png');
    expect(withdrawAssetEl.nativeElement.innerHTML).toContain('USDC');
    expect(withdrawAssetImgEl.attributes.src).toEqual('assets/img/coins/USDC.png');
    expect(profileEl.nativeElement.innerHTML).toContain('defi_investments.shared.expandable_investment_info.profiles.conservative');
    expect(providerEl.nativeElement.innerHTML).toContain('2PI');
  });

});
