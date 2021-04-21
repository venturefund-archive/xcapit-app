import { CurrencyFormatPipe } from './../../pipes/currency-format/currency-format.pipe';
import { waitForAsync, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { FundPortfolioCardComponent } from './fund-portfolio-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { DecimalPipe } from '@angular/common';
import { HideTextPipe } from 'src/app/shared/pipes/hide-text/hide-text.pipe';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';

const testBalance = {
  balance: {
    balance_fin: 23,
    summary: [],
    to_ca: [
      {
        end_balance: 1,
      },
    ],
  },
  fund: {
    currency: 'BTC',
  },
};

describe('FundPortfolioCardComponent', () => {
  let component: FundPortfolioCardComponent;
  let fixture: ComponentFixture<FundPortfolioCardComponent>;
  let apiFundsSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundPortfolioCardComponent>;
  let modalControllerSpy: any;
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

      modalControllerSpy = jasmine.createSpyObj(
        'ModalController',
        modalControllerMock
      );
      apiFundsSpy = jasmine.createSpyObj('ApiFundsService', {
        getBalance: of(testBalance),
      });

      TestBed.configureTestingModule({
        declarations: [
          FundPortfolioCardComponent,
          TrackClickDirective,
          CurrencyFormatPipe,
          DecimalPipe,
          HideTextPipe,
        ],
        imports: [
          IonicModule,
          TranslateModule.forRoot(),
          HttpClientTestingModule,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          CurrencyFormatPipe,
          DecimalPipe,
          HideTextPipe,
          { provide: ApiFundsService, useValue: apiFundsSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: Storage, useValue: storageMock },
          { provide: LocalStorageService, useValue: localStorageServiceMock },
        ],
      }).compileComponents();
      storage = TestBed.inject(Storage);
      fixture = TestBed.createComponent(FundPortfolioCardComponent);
      component = fixture.componentInstance;
      component.fundBalance = testBalance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  beforeEach(() => {
    localStorageService = TestBed.inject(LocalStorageService);
  });

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

  it('should call setTotals on init', () => {
    const spy = spyOn(component, 'setTotals');
    const spySubscribeHideFunds = spyOn(component, 'subscribeOnHideFunds');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spySubscribeHideFunds).toHaveBeenCalledTimes(1);
  });

  it('should call setCurrency on init', () => {
    const spy = spyOn(component, 'setCurrency');
    const spySubscribeHideFunds = spyOn(component, 'subscribeOnHideFunds');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spySubscribeHideFunds).toHaveBeenCalledTimes(1);
  });

  it('should call orderChartData on init', () => {
    const spy = spyOn(component, 'orderChartData');
    const spySubscribeHideFunds = spyOn(component, 'subscribeOnHideFunds');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spySubscribeHideFunds).toHaveBeenCalledTimes(1);
  });

  it('should call ModalController create on viewDetails', () => {
    component.viewDetails();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when View Details is clicked', async (done) => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'View Details'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.whenStable().then(() => {
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });
    done();
  });
});
