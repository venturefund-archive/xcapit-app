import {  ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BigNumber } from 'ethers';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TwoPiService } from '../../services/two-pi/two-pi.service';
import { DefiInvestmentProductComponent } from './defi-investment-product.component';

const defiProduct = {
  id:'polygon-usdc-aave',
  symbol:'USDC',
  subtitle:'USD coin',
  isComming:false
}

describe('DefiInvestmentProductComponent', () => {
  let component: DefiInvestmentProductComponent;
  let fixture: ComponentFixture<DefiInvestmentProductComponent>;
  let vaultSpy : jasmine.SpyObj<any>;
  let twoPiServiceSpy: jasmine.SpyObj<TwoPiService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DefiInvestmentProductComponent>;
  
  beforeEach(waitForAsync(() => {
    vaultSpy = jasmine.createSpyObj('vault',{
      apy : Promise.resolve(0.2278544),
      tvl : Promise.resolve(BigNumber.from('0x012f0eb2a88a')),
      tokenDecimals : Promise.resolve(BigNumber.from(6))
    },{
      id : 'polygon-usdc-aave'
    })

    twoPiServiceSpy = jasmine.createSpyObj('TwoPiService', {
      getVaults: [vaultSpy], 
    });

    TestBed.configureTestingModule({
      declarations: [ DefiInvestmentProductComponent, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{provide: TwoPiService , useValue: twoPiServiceSpy}]
    }).compileComponents();

    fixture = TestBed.createComponent(DefiInvestmentProductComponent);
    component = fixture.componentInstance;
    component.product = defiProduct;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly tvl and apy of vaults', async () => {
     component.ngOnInit();
     fixture.detectChanges();
     await fixture.whenRenderingDone()
     const liquidityEl = fixture.debugElement.query(By.css('div.dip__content__liquidity__liq > ion-text'));
     expect(liquidityEl.nativeElement.innerHTML).toContain('1,301,621.68 USD')
     const performanceEl = fixture.debugElement.query(By.css('ion-badge.dip__footer__badge'));
     expect(performanceEl.nativeElement.innerHTML).toContain('22.78');
  });

  it('should call trackEvent when Invest button is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Invest');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
