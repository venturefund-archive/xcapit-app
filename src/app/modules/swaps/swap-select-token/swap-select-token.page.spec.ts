import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SwapSelectTokenPage } from './swap-select-token.page';
import { TrackService } from '../../../shared/services/track/track.service';
import { IntersectedTokensFactory } from '../shared-swaps/models/intersected-tokens/factory/intersected-tokens.factory';
import { DefaultTokens } from '../shared-swaps/models/tokens/tokens';
import { RawToken, TokenRepo } from '../shared-swaps/models/token-repo/token-repo';
import { rawMATICData, rawTokensData, rawUSDCData } from '../shared-swaps/models/fixtures/raw-tokens-data';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { rawPolygonData } from '../shared-swaps/models/fixtures/raw-blockchains-data';
import { FakeActivatedRoute } from '../../../../testing/fakes/activated-route.fake.spec';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('SwapSelectTokenPage', () => {
  let component: SwapSelectTokenPage;
  let fixture: ComponentFixture<SwapSelectTokenPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let intersectedTokensFactorySpy: jasmine.SpyObj<IntersectedTokensFactory>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeActivatedRoute: FakeActivatedRoute;
  const rawBlockchain = rawPolygonData;
  const fromToken = rawUSDCData;
  const toToken = rawMATICData;
  const urlToSwapHome = (fromToken: RawToken, toToken: RawToken) => [
    'swaps/home/blockchain',
    rawBlockchain.name,
    'from-token',
    fromToken.contract,
    'to-token',
    toToken.contract,
  ];
  const currentUrlParams = {
    blockchain: rawBlockchain.name,
    fromToken: fromToken.contract,
    toToken: toToken.contract,
    tokenToSelect: 'fromToken',
    fromTokenAmount: '1',
  };
  beforeEach(waitForAsync(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    intersectedTokensFactorySpy = jasmine.createSpyObj('IntersectedTokensFactory', {
      create: new DefaultTokens(new TokenRepo(rawTokensData)),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    fakeActivatedRoute = new FakeActivatedRoute(currentUrlParams);
    activatedRouteSpy = fakeActivatedRoute.createSpy();

    TestBed.configureTestingModule({
      declarations: [SwapSelectTokenPage],
      imports: [TranslateModule.forRoot(), IonicModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: IntersectedTokensFactory, useValue: intersectedTokensFactorySpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SwapSelectTokenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track screenview event on init', async () => {
    await component.ionViewDidEnter();

    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('navigate when from token change', async () => {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'from-token-amount': '1',
      },
    };
    await component.ionViewDidEnter();
    fixture.detectChanges();
    const tokenSelectionListEl = fixture.debugElement.query(By.css('app-token-selection-list'));

    tokenSelectionListEl.triggerEventHandler('clickedCoin', rawMATICData);

    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(
      urlToSwapHome(rawMATICData, rawMATICData),
      navigationExtras
    );
  });

  it('navigate when to token change', async () => {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'from-token-amount': '1',
      },
    };
    fakeActivatedRoute.modifySnapshotParams({ ...currentUrlParams, tokenToSelect: 'toToken' });
    await component.ionViewDidEnter();
    fixture.detectChanges();
    const tokenSelectionListEl = fixture.debugElement.query(By.css('app-token-selection-list'));

    tokenSelectionListEl.triggerEventHandler('clickedCoin', rawUSDCData);

    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(
      urlToSwapHome(rawUSDCData, rawUSDCData),
      navigationExtras
    );
  });
});
