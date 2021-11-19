import { CurrencyFormatPipe } from '../../pipes/currency-format/currency-format.pipe';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { FundCardComponent } from './fund-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbsoluteValuePipe } from '../../pipes/absolute-value/absolute-value.pipe';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DecimalPipe } from '@angular/common';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { StrategyNamePipe } from '../../pipes/strategy-name/strategy-name.pipe';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';
import { of } from 'rxjs';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';
import { HideTextPipe } from '../../../../../shared/pipes/hide-text/hide-text.pipe';
import { By } from '@angular/platform-browser';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { ToastService } from '../../../../../shared/services/toast/toast.service';

const activeFund = {
  fund_name: 'Test',
  profile: 'volume_profile_strategies_USDT',
  end_balance: 10,
  state: 'active',
  currency: 'USDT',
  total_profit: 100,
  start_time: '2021-10-01',
  end_time: '2021-10-31',
};

const finishedFund = {
  ...activeFund,
  state: 'finalizado',
};

describe('FundCardComponent', () => {
  let component: FundCardComponent;
  let fixture: ComponentFixture<FundCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundCardComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let apiFundsServiceSpy: jasmine.SpyObj<ApiFundsService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  beforeEach(
    waitForAsync(() => {
      localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', {}, { hideFunds: of(true) });
      apiFundsServiceSpy = jasmine.createSpyObj('ApiFundsService', { unsubscribe: of({}) });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      toastServiceSpy = jasmine.createSpyObj('ToastService', { showToast: Promise.resolve() });
      alertControllerSpy = jasmine.createSpyObj('AlertController', {
        create: Promise.resolve({ present: () => Promise.resolve() }),
      });
      TestBed.configureTestingModule({
        declarations: [
          FundCardComponent,
          AbsoluteValuePipe,
          FakeTrackClickDirective,
          CurrencyFormatPipe,
          DecimalPipe,
          StrategyNamePipe,
          HideTextPipe,
        ],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          CurrencyFormatPipe,
          DecimalPipe,
          { provide: NavController, useValue: navControllerSpy },
          { provide: LocalStorageService, useValue: localStorageServiceSpy },
          { provide: ApiFundsService, useValue: apiFundsServiceSpy },
          { provide: ToastService, useValue: toastServiceSpy },
          { provide: AlertController, useValue: alertControllerSpy },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(FundCardComponent);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  describe('With active fund', () => {
    beforeEach(() => {
      component.fund = activeFund;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set created time on init when diff are days', () => {
      component.fund.start_time = '2021-10-01 00:00';
      component.fund.end_time = '2021-10-31 00:00';
      component.ngOnInit();
      expect(component.createdTime[0]).toBe('days');
      expect(component.createdTime[1]).toBe(30);
    });

    it('should set created time on init when diff are hours', () => {
      component.fund.start_time = '2021-10-01 00:00';
      component.fund.end_time = '2021-10-01 01:00';
      component.ngOnInit();
      expect(component.createdTime[0]).toBe('hours');
      expect(component.createdTime[1]).toBe(1);
    });

    it('should set created time on init when diff are minutes', () => {
      component.fund.start_time = '2021-10-01 00:00';
      component.fund.end_time = '2021-10-01 00:10';
      component.ngOnInit();
      expect(component.createdTime[0]).toBe('minutes');
      expect(component.createdTime[1]).toBe(10);
    });

    it('should set created time on init when diff are seconds', () => {
      component.fund.start_time = '2021-10-01 00:00:00';
      component.fund.end_time = '2021-10-01 00:00:20';
      component.ngOnInit();
      expect(component.createdTime[0]).toBe('seconds');
      expect(component.createdTime[1]).toBe(20);
    });

    it('should call unsubscribe when Unsubscribe button is clicked and not owner', async () => {
      component.owner = false;
      fixture.detectChanges();
      component.ngOnInit();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Unsubscribe"'));
      buttonEl.nativeElement.click();
      component.unsubscribe();
      expect(apiFundsServiceSpy.unsubscribe).toHaveBeenCalledOnceWith('Test');
    });

    it('should navigate to detail when View Fund button is clicked', async () => {
      fixture.detectChanges();
      component.ngOnInit();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      const buttonEl = fixture.debugElement.query(By.css('ion-button[name="View Fund"'));
      buttonEl.nativeElement.click();
      component.unsubscribe();
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['funds/detail', 'Test']);
    });
  });

  describe('With finished fund', () => {
    beforeEach(() => {
      component.fund = finishedFund;
      fixture.detectChanges();
    });

    it('should navigate to finished funds when View Fund button is clicked', async () => {
      component.ngOnInit();
      fixture.detectChanges();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Renovate Fund"'));
      buttonEl.nativeElement.click();
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['funds/funds-finished']);
    });

    it('should call unsubscribe when Unsubscribe button is clicked and not owner', async () => {
      component.owner = false;
      component.ngOnInit();
      fixture.detectChanges();
      await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Unsubscribe"'));
      buttonEl.nativeElement.click();
      component.unsubscribe();
      expect(apiFundsServiceSpy.unsubscribe).toHaveBeenCalledOnceWith('Test');
      expect(toastServiceSpy.showToast).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when Renovate Fund is clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Renovate Fund');
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spyClickEvent = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });
  });
});
