import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { FundSummaryPage } from './fund-summary.page';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { StrategyNamePipe } from '../shared-funds/pipes/strategy-name/strategy-name.pipe';
import { StopLossTakeProfitSummaryComponent } from './components/stop-loss-take-profit-summary/stop-loss-take-profit-summary.component';
import { StorageApikeysService } from '../../apikeys/shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.helper';

const fund = {
  stop_loss: 10,
  take_profit: 15,
  currency: 'USDT',
  risk_level: 'Mary_Index',
  fund_name: 'Test fund',
  trailing_stop: 20,
};

describe('FundSummaryPage', () => {
  let component: FundSummaryPage;
  let fixture: ComponentFixture<FundSummaryPage>;
  let apiFundsServiceSpy: jasmine.SpyObj<ApiFundsService>;
  let fundDataStorageServiceSpy: jasmine.SpyObj<FundDataStorageService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageApikeysServiceSpy: jasmine.SpyObj<StorageApikeysService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundSummaryPage>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      storageApikeysServiceSpy = jasmine.createSpyObj(
        'StorageApikeysService',
        {},
        {
          data: { id: 1, alias: '', nombre_bot: '' },
        }
      );
      fundDataStorageServiceSpy = jasmine.createSpyObj('FundDataStorageService', {
        getData: Promise.resolve({}),
        setData: Promise.resolve({}),
        getFund: Promise.resolve(fund),
        clearAll: Promise.resolve({}),
      });
      apiFundsServiceSpy = jasmine.createSpyObj(
        'ApiFundsService',
        {
          renewFund: of({}),
        },
        {
          crud: jasmine.createSpyObj('CRUD', { create: of({}) }),
        }
      );
      TestBed.configureTestingModule({
        declarations: [FundSummaryPage, StrategyNamePipe, StopLossTakeProfitSummaryComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ApiFundsService, useValue: apiFundsServiceSpy },
          { provide: FundDataStorageService, useValue: fundDataStorageServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: StorageApikeysService, useValue: storageApikeysServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FundSummaryPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be rendered properly', async () => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenRenderingDone();

    const titleEl = fixture.debugElement.query(By.css('.fs__title ion-text'));
    expect(titleEl.nativeElement.innerHTML).toContain('Test fund');

    const strategyEl = fixture.debugElement.query(By.css('.fs__strategy ion-text'));
    expect(strategyEl.nativeElement.innerHTML).toContain(
      'funds.fund_summary.strategyfunds.fund_investment.card.profiles.Mary_Index.title'
    );
  });

  it('should get fund and opType new on view will enter', async () => {
    fundDataStorageServiceSpy.getData.withArgs('fundRenew').and.returnValue(Promise.resolve(false));
    component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.fund).toEqual(fund);
    expect(component.opType).toBe('new');
  });

  it('should get fund and opType renew when is renew on view will enter', async () => {
    fundDataStorageServiceSpy.getData.withArgs('fundRenew').and.returnValue(Promise.resolve(true));
    component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.fund).toEqual(fund);
    expect(component.opType).toBe('renew');
  });

  it('should create fund and navigate to fund-success when fundRenew is false', async () => {
    fundDataStorageServiceSpy.getData.withArgs('fundRenew').and.returnValue(Promise.resolve(false));
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Create Fund"]')).nativeElement.click();
    await fixture.whenStable();

    expect(apiFundsServiceSpy.crud.create).toHaveBeenCalledTimes(1);
    expect(fundDataStorageServiceSpy.clearAll).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/funds/fund-success', false], {
      replaceUrl: true,
    });
  });

  it('should renew fund and navigate to fund-success when fund renew', async () => {
    fundDataStorageServiceSpy.getData.withArgs('fundRenew').and.returnValue(Promise.resolve(true));
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Create Fund"]')).nativeElement.click();
    await fixture.whenStable();

    expect(apiFundsServiceSpy.renewFund).toHaveBeenCalledTimes(1);
    expect(fundDataStorageServiceSpy.clearAll).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/funds/fund-success', true], {
      replaceUrl: true,
    });
  });

  it('should navigate to home when click in skip invest button', async () => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Skip Invest"]')).nativeElement.click();
    await fixture.whenStable();

    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('/tabs/home');
  });

  it('should call trackEvent on trackService when Create Fund button clicked', async () => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Create Fund');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Skip Invest button clicked', async () => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Skip Invest');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
