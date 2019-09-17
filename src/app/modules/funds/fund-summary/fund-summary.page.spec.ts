import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundSummaryPage } from './fund-summary.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';
import { CurrencyPercentagePipe } from '../shared-funds/pipes/currency-percentage/currency-percentage.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ApiSubscriptionsService } from '../../subscriptions/shared-subscriptions/services/api-subscriptions/api-subscriptions.service';

const fundStatusMockData = {
  fund: {
    estado: 'active'
  },
  status: {
    date_info: {}
  }
};

describe('FundSummaryPage', () => {
  let component: FundSummaryPage;
  let fixture: ComponentFixture<FundSummaryPage>;
  let apiFundServiceMock: any;
  let subscriptionsServiceSpy: any;
  let activatedRouteSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundSummaryPage>;
  let apiSubscriptionsServiceSpy: any;
  let alertControllerSpy: any;

  beforeEach(async(() => {
    apiFundServiceMock = {
      getStatus: () => of(fundStatusMockData),
      pauseFundRuns: () => of(null),
      resumeFundRuns: () => of(null),
      finalizeFundRuns: () => of(null),
      getFundRuns: () => of(null),
      changeFundCA: () => of(null)
    };
    subscriptionsServiceSpy = jasmine.createSpyObj('SubscriptionsService', [
      'shareSubscriptionLink'
    ]);
    apiSubscriptionsServiceSpy = jasmine.createSpyObj(
      'ApiSubscriptionsService',
      ['unsubscribeToFund']
    );
    apiSubscriptionsServiceSpy.unsubscribeToFund.and.returnValue(of({}));
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        fundName: 'asfd'
      })
    };
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    TestBed.configureTestingModule({
      declarations: [
        FundSummaryPage,
        CurrencyPercentagePipe,
        TrackClickDirective,
        DummyComponent
      ],
      imports: [
        IonicModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'funds/runs/:fundName', component: DummyComponent },
          { path: 'funds/fund-balance/:fundName', component: DummyComponent }
        ]),
        ReactiveFormsModule
      ],
      providers: [
        { provide: ApiFundsService, useValue: apiFundServiceMock },
        { provide: SubscriptionsService, useValue: subscriptionsServiceSpy },
        {
          provide: ApiSubscriptionsService,
          useValue: apiSubscriptionsServiceSpy
        },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundServiceMock = TestBed.get(ApiFundsService);
    subscriptionsServiceSpy = TestBed.get(SubscriptionsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFundName on ionViewWillEnter', () => {
    const getFundStatusSpy = spyOn(component, 'getFundStatus');
    getFundStatusSpy.and.returnValue(of({}));
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(getFundStatusSpy).toHaveBeenCalledTimes(1);
  });

  it('should call shareSubscriptionLink when getSubscriptionLink is callled', () => {
    component.shareFund();
    expect(subscriptionsServiceSpy.shareSubscriptionLink).toHaveBeenCalledTimes(
      1
    );
  });

  it('should call pauseFundRuns once on pauseFund button click', () => {
    const pauseFundRunsSpy = spyOn(apiFundServiceMock, 'pauseFundRuns');
    pauseFundRunsSpy.and.returnValue(of(null));
    component.pauseFundRuns();
    expect(pauseFundRunsSpy).toHaveBeenCalledTimes(1);
  });

  it('should call resumeFundRuns once on resumeFund button click', () => {
    const resumeFundRunsSpy = spyOn(apiFundServiceMock, 'resumeFundRuns');
    resumeFundRunsSpy.and.returnValue(of(null));
    component.resumeFundRuns();
    expect(resumeFundRunsSpy).toHaveBeenCalledTimes(1);
  });

  it('should call finalizeFundRuns once on finalizeFund button click', () => {
    const finalizeFundRunsSpy = spyOn(apiFundServiceMock, 'finalizeFundRuns');
    finalizeFundRunsSpy.and.returnValue(of(null));
    component.finalizeFundRuns();
    expect(finalizeFundRunsSpy).toHaveBeenCalledTimes(1);
  });

  it('should call changeFundCA once on form is valid button click', () => {
    const changeFundCASpy = spyOn(apiFundServiceMock, 'changeFundCA');
    changeFundCASpy.and.returnValue(of(null));
    component.form.patchValue({ ca: 'BTC' });
    component.changeFundCA();
    expect(changeFundCASpy).toHaveBeenCalledTimes(1);
  });

  it('shouldnt call changeFundCA when form is invalid and button click', () => {
    const changeFundCASpy = spyOn(apiFundServiceMock, 'changeFundCA');
    changeFundCASpy.and.returnValue(of(null));
    component.changeFundCA();
    expect(changeFundCASpy).toHaveBeenCalledTimes(0);
  });

  it('should call getStatus once on ionViewWillEnter', () => {
    const getStatusSpy = spyOn(apiFundServiceMock, 'getStatus');
    getStatusSpy.and.returnValue(of(fundStatusMockData));
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(getStatusSpy).toHaveBeenCalledTimes(1);
  });

  it('should match valid status', () => {
    component.fundStatus = { fund: { estado: 'toBTC-NF' } };
    fixture.detectChanges();
    component.isInCAStatus();
    expect(component.inCAStatus).toBeTruthy();
  });

  it('shouldnt match invalid status', () => {
    component.fundStatus = { fund: { estado: 'active' } };
    fixture.detectChanges();
    component.isInCAStatus();
    expect(component.inCAStatus).toBeFalsy();
  });

  describe('with fund and is owner', () => {
    beforeEach(() => {
      component.fundStatus = fundStatusMockData;
      component.isOwner = true;
      fixture.detectChanges();
    });

    it('should call trackEvent on trackService when Share Fund is clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName(
        'ion-fab-button',
        'Share Fund'
      );
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spyClickEvent = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when Edit Fund is clicked', () => {
      fixture.whenStable().then(() => {
        const el = trackClickDirectiveHelper.getByElementByName(
          'ion-button',
          'Edit Fund'
        );
        const directive = trackClickDirectiveHelper.getDirective(el);
        const spyClickEvent = spyOn(directive, 'clickEvent');
        el.nativeElement.click();
        fixture.detectChanges();
        expect(spyClickEvent).toHaveBeenCalledTimes(1);
      });
    });

    it('should call trackEvent on trackService when Renew Fund is clicked', () => {
      fixture.whenStable().then(() => {
        const el = trackClickDirectiveHelper.getByElementByName(
          'ion-button',
          'Renew Fund'
        );
        const directive = trackClickDirectiveHelper.getDirective(el);
        const spyClickEvent = spyOn(directive, 'clickEvent');
        el.nativeElement.click();
        fixture.detectChanges();
        expect(spyClickEvent).toHaveBeenCalledTimes(1);
      });
    });

    it('should call trackEvent on trackService when Runs Fund is clicked', () => {
      fixture.whenStable().then(() => {
        const el = trackClickDirectiveHelper.getByElementByName(
          'ion-button',
          'Runs Fund'
        );
        const directive = trackClickDirectiveHelper.getDirective(el);
        const spyClickEvent = spyOn(directive, 'clickEvent');
        el.nativeElement.click();
        fixture.detectChanges();
        expect(spyClickEvent).toHaveBeenCalledTimes(1);
      });
    });

    it('should call trackEvent on trackService when Fund Balance is clicked', () => {
      fixture.whenStable().then(() => {
        const el = trackClickDirectiveHelper.getByElementByName(
          'ion-button',
          'Fund Balance'
        );
        const directive = trackClickDirectiveHelper.getDirective(el);
        const spyClickEvent = spyOn(directive, 'clickEvent');
        el.nativeElement.click();
        fixture.detectChanges();
        expect(spyClickEvent).toHaveBeenCalledTimes(1);
      });
    });

    it('should call trackEvent on trackService when Finalize Fund is clicked', () => {
      fixture.whenStable().then(() => {
        const el = trackClickDirectiveHelper.getByElementByName(
          'ion-button',
          'Finalize Fund'
        );
        const directive = trackClickDirectiveHelper.getDirective(el);
        const spyClickEvent = spyOn(directive, 'clickEvent');
        el.nativeElement.click();
        fixture.detectChanges();
        expect(spyClickEvent).toHaveBeenCalledTimes(1);
      });
    });

    it('should call trackEvent on trackService when Pause Fund is clicked', () => {
      fixture.whenStable().then(() => {
        const el = trackClickDirectiveHelper.getByElementByName(
          'ion-button',
          'Pause Fund'
        );
        const directive = trackClickDirectiveHelper.getDirective(el);
        const spyClickEvent = spyOn(directive, 'clickEvent');
        el.nativeElement.click();
        fixture.detectChanges();
        expect(spyClickEvent).toHaveBeenCalledTimes(1);
      });
    });

    it('should call trackEvent on trackService when Change Fund CA is clicked', () => {
      component.fundStatus.fund.estado = 'pausado';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const el = trackClickDirectiveHelper.getByElementByName(
          'ion-button',
          'Change Fund CA'
        );
        const directive = trackClickDirectiveHelper.getDirective(el);
        const spyClickEvent = spyOn(directive, 'clickEvent');
        el.nativeElement.click();
        fixture.detectChanges();
        expect(spyClickEvent).toHaveBeenCalledTimes(1);
      });
    });

    it('should call trackEvent on trackService when select is change', () => {
      component.fundStatus.fund.estado = 'pausado';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const el = trackClickDirectiveHelper.getElement('ion-select');
        const directive = trackClickDirectiveHelper.getDirective(el);
        const spy = spyOn(directive, 'changeEvent');
        el.nativeElement.value = 'BTC';
        el.nativeElement.dispatchEvent(new Event('ionChange'));
        fixture.detectChanges();
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  it('should call unsubscribeToFund when unsubscribe is callled', () => {
    component.unsubscribe();
    expect(apiSubscriptionsServiceSpy.unsubscribeToFund).toHaveBeenCalledTimes(
      1
    );
  });

  it('should call create on alert when unsubscribeAlert is callled', () => {
    component.unsubscribeAlert().then(() => {
      expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
    });
  });
});
