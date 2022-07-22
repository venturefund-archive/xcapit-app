import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { ExpandableInvestmentInfoComponent } from './expandable-investment-info.component';
import { SplitStringPipe } from 'src/app/shared/pipes/split-string/split-string.pipe';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

const usdc_coin = {
  id: 7,
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

const dai_coin = {
  id: 8,
  name: 'DAI - DAI Coin',
  logoRoute: 'assets/img/coins/USDC.png',
  last: false,
  value: 'DAI',
  network: 'MATIC',
  chainId: 80001,
  rpc: 'http://testrpc.text/',
  moonpayCode: 'dai_polygon',
  decimals: 6,
  symbol: 'DAIUSDT',
};

const btc_coin = {
  id: 9,
  name: 'BTC - USD Coin',
  logoRoute: 'assets/img/coins/BTC.svg',
  last: false,
  value: 'BTC',
  network: 'MATIC',
  chainId: 80001,
  rpc: 'http://testrpc.text/',
  moonpayCode: 'btc_polygon',
  decimals: 6,
  symbol: 'BTCUSDT',
};

const matic_coin = {
  id: 16,
  last: false,
  logoRoute: 'assets/img/coins/MATIC.png',
  moonpayCode: 'matic_polygon',
  name: 'MATIC - Polygon',
  native: true,
  network: 'MATIC',
  rpc: 'http://testrpc.text/',
  symbol: 'MATICUSDT',
  value: 'MATIC',
  decimals: 18
};

const modeTestsData = [
  {
    mode: {
      text: 'defi_investments.shared.expandable_investment_info.investment_info.BTC',
      value: 'mumbai_btc',
      token: btc_coin,
    },
  },
  {
    mode: {
      text: 'defi_investments.shared.expandable_investment_info.investment_info.USDC',
      value: 'mumbai_usdc',
      token: usdc_coin,
    },
  },
  {
    mode: {
      text: 'defi_investments.shared.expandable_investment_info.investment_info.DAI',
      value: 'mumbai_dai',
      token: dai_coin,
    },
  },
];

describe('ExpandableInvestmentInfoComponent', () => {
  let component: ExpandableInvestmentInfoComponent;
  let fixture: ComponentFixture<ExpandableInvestmentInfoComponent>;
  let investmentProductSpy: jasmine.SpyObj<InvestmentProduct>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(
    waitForAsync(() => {
      investmentProductSpy = jasmine.createSpyObj('InvestmentProduct', {
        token: usdc_coin,
        nativeToken: matic_coin,
        tvl: 15800500,
        apy: 12.66,
        type: 'Vault',
        provider: '2PI',
        name: 'mumbai_usdc',
      });
      fakeModalController = new FakeModalController({ data: 'fake_password' });
      modalControllerSpy = fakeModalController.createSpy();
      remoteConfigSpy = jasmine.createSpyObj('RemoteConfigSpy', {
        getObject: [{ id: 'mumbai_usdc', isComing: false, category: 'conservative' }],
      });
      TestBed.configureTestingModule({
        declarations: [ExpandableInvestmentInfoComponent, SplitStringPipe],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: RemoteConfigService, useValue: remoteConfigSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ExpandableInvestmentInfoComponent);
      component = fixture.componentInstance;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  modeTestsData.forEach((testCase) => {
    describe(`${testCase.mode.value} Mode`, () => {
      beforeEach(() => {
        investmentProductSpy.name.and.returnValue(testCase.mode.value);
        investmentProductSpy.token.and.returnValue(testCase.mode.token);
        remoteConfigSpy.getObject.and.returnValue([{ id: testCase.mode.value }]);
        component.investmentProduct = investmentProductSpy;
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
      component.investmentProduct = investmentProductSpy;
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
      const [typeEl, depositAssetEl, withdrawAssetEl, nativeTokenEl, tokenEl,providerEl, profileEl] = fixture.debugElement.queryAll(
        By.css(
          'ion-label.eif__accordion__content__information-item ion-text.eif__accordion__content__information-item__text'
        )
      );
      const [depositAssetImgEl, withdrawAssetImgEl] = fixture.debugElement.queryAll(
        By.css('ion-item.split-information-item div.inline-image>img')
      );
      const informativeIcon = fixture.debugElement.query(By.css('ion-icon[icon="information-circle"]'));
      expect(blockchainBadgeEl).toBeTruthy();
      expect(tokenSymbolEl.nativeElement.innerHTML).toEqual('USDC');
      expect(tokenNameEl.nativeElement.innerHTML).toEqual('USD Coin');
      expect(apyEl.nativeElement.innerHTML).toContain('12.66');
      expect(informativeIcon).toBeTruthy();
      expect(typeEl.nativeElement.innerHTML).toContain('Vault');
      expect(depositAssetEl.nativeElement.innerHTML).toContain('USDC');
      expect(depositAssetImgEl.attributes.src).toEqual('assets/img/coins/USDC.png');
      expect(withdrawAssetEl.nativeElement.innerHTML).toContain('USDC');
      expect(withdrawAssetImgEl.attributes.src).toEqual('assets/img/coins/USDC.png');
      expect(profileEl.nativeElement.innerHTML).toContain(
        'defi_investments.shared.expandable_investment_info.profiles.conservative'
      );
      expect(providerEl.nativeElement.innerHTML).toContain('2PI');
      expect(nativeTokenEl.nativeElement.innerHTML).toContain('MATIC');
      expect(tokenEl.nativeElement.innerHTML).toContain('USDC');
    });

  it('should show modal', async () => {
    component.investmentProduct = investmentProductSpy;
    component.ngOnInit();
    fixture.detectChanges();
    await Promise.all([fixture.whenRenderingDone(), fixture.whenStable()]);
    const el = fixture.debugElement.query(By.css('ion-icon[icon="information-circle"]'));
    el.nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not show modal', async () => {
    component.investmentProduct = investmentProductSpy;
    component.ngOnInit();
    fixture.detectChanges();
    await Promise.all([fixture.whenRenderingDone(), fixture.whenStable()]);
    component.isInfoModalOpen = true
    const el = fixture.debugElement.query(By.css('ion-icon[icon="information-circle"]'));
    el.nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });
});
