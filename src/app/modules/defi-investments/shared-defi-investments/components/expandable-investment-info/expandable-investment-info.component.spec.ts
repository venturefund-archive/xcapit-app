import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { ExpandableInvestmentInfoComponent } from './expandable-investment-info.component';
import { TwoPiInvestmentProduct } from '../../models/two-pi-investment-product/two-pi-investment-product.model';
import { SplitStringPipe } from 'src/app/shared/pipes/split-string/split-string.pipe';

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

const testInvestmentProduct = {
  name: 'usdc_aave',
  token: usdc_coin,
  apy: 12.66,
  tvl: 15800500,
  type: 'Vault',
  provider: '2PI',
} as TwoPiInvestmentProduct;

describe('ExpandableInvestmentInfoComponent', () => {
  let component: ExpandableInvestmentInfoComponent;
  let fixture: ComponentFixture<ExpandableInvestmentInfoComponent>;
  let twoPiInvestmentProductSpy: jasmine.SpyObj<TwoPiInvestmentProduct>;
  beforeEach(
    waitForAsync(() => {
      twoPiInvestmentProductSpy = jasmine.createSpyObj('TwoPiInvestmentProduct', {}, testInvestmentProduct);
      TestBed.configureTestingModule({
        declarations: [ExpandableInvestmentInfoComponent, SplitStringPipe],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ExpandableInvestmentInfoComponent);
      component = fixture.componentInstance;
      component.investmentProduct = twoPiInvestmentProductSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const tokenSymbolEl = fixture.debugElement.query(
      By.css('ion-text.eif__accordion__header__content__text__token-symbol')
    );
    const tokenNameEl = fixture.debugElement.query(
      By.css('ion-text.eif__accordion__header__content__text__token-name')
    );
    const apyEl = fixture.debugElement.query(By.css('ion-badge.ux-font-num-subtitulo'));
    const [tvlEl, typeEl, depositAssetEl, withdrawAssetEl, blockchainEl, providerEl] = fixture.debugElement.queryAll(
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
    expect(tvlEl.nativeElement.innerHTML).toContain('$15,800,500.00');
    expect(typeEl.nativeElement.innerHTML).toContain('Vault');
    expect(depositAssetEl.nativeElement.innerHTML).toContain('USDC');
    expect(depositAssetImgEl.attributes.src).toEqual('assets/img/coins/USDC.png');
    expect(withdrawAssetEl.nativeElement.innerHTML).toContain('USDC');
    expect(withdrawAssetImgEl.attributes.src).toEqual('assets/img/coins/USDC.png');
    expect(blockchainEl.nativeElement.innerHTML).toContain('Polygon');
    expect(providerEl.nativeElement.innerHTML).toContain('2PI');
  });
});
