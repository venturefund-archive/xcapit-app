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
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { LINKS } from 'src/app/config/static-links';

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
  logoRoute: 'assets/img/coins/MATIC.svg',
  moonpayCode: 'matic_polygon',
  name: 'MATIC - Polygon',
  native: true,
  network: 'MATIC',
  rpc: 'http://testrpc.text/',
  symbol: 'MATICUSDT',
  value: 'MATIC',
  decimals: 18,
};

const modeTestsData = [
  {
    mode: {
      title: 'defi_investments.shared.expandable_investment_info.title BTC',
      text: 'defi_investments.shared.expandable_investment_info.investment_info.BTC',
      value: 'mumbai_btc',
      token: btc_coin,
    },
  },
  {
    mode: {
      title: 'defi_investments.shared.expandable_investment_info.title USDC',
      text: 'defi_investments.shared.expandable_investment_info.investment_info.USDC',
      value: 'mumbai_usdc',
      token: usdc_coin,
    },
  },
  {
    mode: {
      title: 'defi_investments.shared.expandable_investment_info.title DAI',
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
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  beforeEach(waitForAsync(() => {
    investmentProductSpy = jasmine.createSpyObj('InvestmentProduct', {
      token: usdc_coin,
      nativeToken: matic_coin,
      tvl: 15800500,
      apy: 12.66,
      type: 'Vault',
      provider: '2PI',
      name: 'mumbai_usdc',
    });
    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
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
        { provide: BrowserService, useValue: browserServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandableInvestmentInfoComponent);
    component = fixture.componentInstance;
  }));

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
        it('should render properly info description and title', async () => {
          component.ngOnInit();
          fixture.detectChanges();
          await fixture.whenRenderingDone();
          await fixture.whenStable();
          const titleEl = fixture.debugElement.query(By.css('.eif__accordion__content__title ion-text'));
          const infoEl = fixture.debugElement.query(By.css('.eif__accordion__content__information-item__info'));
          expect(infoEl.nativeElement.innerHTML).toContain(testCase.mode.text);
          expect(titleEl.nativeElement.innerHTML).toContain(testCase.mode.title);
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
      const [typeEl, depositAndWithdrawAssetEl, nativeTokenEl, tokenEl, profileEl] = fixture.debugElement.queryAll(
        By.css(
          'ion-label.eif__accordion__content__information-item ion-text.eif__accordion__content__information-item__text'
        )
      );
      const depositAndWithdrawAssetImg = fixture.debugElement.query(
        By.css('ion-item.split-information-item div.inline-image img')
      );
      const informativeIcon = fixture.debugElement.query(By.css('ion-icon[icon="information-circle"]'));
      const compEl = fixture.debugElement.query(By.css('div.eif__accordion__header__content > img'));
      const defiInfoButtonEl = fixture.debugElement.query(
        By.css('.eif__accordion__content__information-item__button ion-button')
      );
      expect(compEl).toBeTruthy();
      expect(blockchainBadgeEl).toBeTruthy();
      expect(defiInfoButtonEl).toBeTruthy();
      expect(tokenSymbolEl.nativeElement.innerHTML).toEqual('USDC');
      expect(tokenNameEl.nativeElement.innerHTML).toEqual('USD Coin');
      expect(apyEl.nativeElement.innerHTML).toContain('12.66');
      expect(informativeIcon).toBeTruthy();
      expect(typeEl.nativeElement.innerHTML).toContain('Vault');
      expect(depositAndWithdrawAssetEl.nativeElement.innerHTML).toContain('USDC');
      expect(depositAndWithdrawAssetImg.attributes.src).toEqual('assets/img/coins/USDC.png');

      expect(profileEl.nativeElement.innerHTML).toContain(
        'defi_investments.shared.expandable_investment_info.profiles.conservative'
      );
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
    component.isInfoModalOpen = true;
    const el = fixture.debugElement.query(By.css('ion-icon[icon="information-circle"]'));
    el.nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });

  it('should navigate to twoPi page on browser when link is clicked', async () => {
    component.investmentProduct = investmentProductSpy;
    component.ngOnInit();
    fixture.detectChanges();
    await Promise.all([fixture.whenRenderingDone(), fixture.whenStable()]);
    fixture.debugElement
      .query(By.css('.eif__accordion__content__information-item__button ion-button'))
      .nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: LINKS.twoPiPage });
  });
});
