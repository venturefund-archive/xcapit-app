import { CurrencyFormatPipe } from './../../pipes/currency-format/currency-format.pipe';
import { waitForAsync, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { AlertController, IonicModule } from '@ionic/angular';
import { FundSummaryCardComponent } from './fund-summary-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { ApiSubscriptionsService } from 'src/app/modules/subscriptions/shared-subscriptions/services/api-subscriptions/api-subscriptions.service';
import { ShareService } from 'src/app/shared/services/share/share.service';
import { FundSummaryInterface } from './fund-summary.interface';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DecimalPipe } from '@angular/common';
import { alertControllerMock } from '../../../../../../testing/spies/alert-controller-mock.spec';
import { HideTextPipe } from 'src/app/shared/pipes/hide-text/hide-text.pipe';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
const testData = { link: 'https://test.link' };
const testSummary: FundSummaryInterface = {
  fund: { nombre_bot: 'Test', currency: 'BTC' },
  balance: {
    start_balance: '',
    end_balance: '',
  },
};
describe('FundSummaryCardComponent', () => {
  let component: FundSummaryCardComponent;
  let fixture: ComponentFixture<FundSummaryCardComponent>;
  let apiSubscriptionsSpy: any;
  let shareServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundSummaryCardComponent>;
  let alertControllerSpy: any;
  let localStorageService: LocalStorageService;
  let localStorageServiceMock: any;
  let storageMock: any;
  let storage: Storage;

  beforeEach(
    waitForAsync(() => {
      localStorageServiceMock = {
        toggleHideFunds: () => undefined,
        getHideFunds: () => Promise.resolve(true),
      };
      storageMock = {
        get: () => Promise.resolve(),
        set: () => Promise.resolve(),
        remove: () => Promise.resolve(),
      };
      apiSubscriptionsSpy = jasmine.createSpyObj('ApiSubscriptionsService', ['getSubscriptionLink']);
      alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);
      shareServiceSpy = jasmine.createSpyObj('ShareService', ['share']);
      TestBed.configureTestingModule({
        declarations: [
          FundSummaryCardComponent,
          FakeTrackClickDirective,
          CurrencyFormatPipe,
          DecimalPipe,
          HideTextPipe,
        ],
        imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          CurrencyFormatPipe,
          DecimalPipe,
          HideTextPipe,
          { provide: ApiSubscriptionsService, useValue: apiSubscriptionsSpy },
          { provide: ShareService, useValue: shareServiceSpy },
          { provide: AlertController, useValue: alertControllerSpy },
          { provide: Storage, useValue: storageMock },
          { provide: LocalStorageService, useValue: localStorageServiceMock },
        ],
      }).compileComponents();

      localStorageService = TestBed.inject(LocalStorageService);
      storage = TestBed.inject(Storage);
      fixture = TestBed.createComponent(FundSummaryCardComponent);
      component = fixture.componentInstance;
      component.summary = testSummary;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call SubscribeOnHideFunds on init', fakeAsync(() => {
    const spy = spyOn(component, 'subscribeOnHideFunds');
    const spyNgOnInit = spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(spyNgOnInit).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(2);
  }));

  it('should call shareService.share on shareSubscriptionLink', () => {
    apiSubscriptionsSpy.getSubscriptionLink.and.returnValue(of(testData));
    shareServiceSpy.share.and.returnValue(Promise.resolve());
    component.shareSubscriptionLink();
    expect(shareServiceSpy.share).toHaveBeenCalledTimes(1);
  });

  it('should call SetTotals on init', () => {
    spyOn(component, 'subscribeOnHideFunds');
    const spy = spyOn(component, 'setTotals');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call SetCurrency on init', () => {
    spyOn(component, 'subscribeOnHideFunds');
    const spy = spyOn(component, 'setCurrency');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Share is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Share');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    apiSubscriptionsSpy.getSubscriptionLink.and.returnValue(of(testData));
    shareServiceSpy.share.and.returnValue(Promise.resolve());
    component.shareSubscriptionLink();
    el.nativeElement.click();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
