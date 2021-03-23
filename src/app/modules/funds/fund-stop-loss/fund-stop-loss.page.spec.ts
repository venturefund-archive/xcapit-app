import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundStopLossPage } from './fund-stop-loss.page';
import { of } from 'rxjs';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';

const formData = {
  valid: {
    stop_loss: 15,
  },
  invalid: {
    stop_loss: '',
  },
};

describe('FundStopLossPage', () => {
  let component: FundStopLossPage;
  let fixture: ComponentFixture<FundStopLossPage>;
  let fundDataStorageServiceMock: any;
  let fundDataStorageService: any;
  let apiFundsMock: any;
  let apiFundsService: any;
  let modalControllerSpy: any;
  let navControllerSpy: any;
  let fundDataStorageServiceSpy: any;

  beforeEach(waitForAsync(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);

    fundDataStorageServiceMock = {
      getData: () => Promise.resolve({}),
      setData: () => Promise.resolve({}),
      getFund: () => Promise.resolve({}),
      clearAll: () => Promise.resolve({}),
    };
    apiFundsMock = {
      crud: {
        create: () => of(),
      },
      renewFund: () => of(),
    };

    TestBed.configureTestingModule({
      declarations: [FundStopLossPage, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'funds/fund-success',
            component: DummyComponent,
          },
        ]),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        IonicModule,
      ],
      providers: [
        {
          provide: FundDataStorageService,
          useValue: fundDataStorageServiceMock,
        },
        {
          provide: ApiFundsService,
          useValue: apiFundsMock,
        },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundStopLossPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fundDataStorageService = TestBed.inject(FundDataStorageService);
    apiFundsService = TestBed.inject(ApiFundsService);
    fundDataStorageServiceSpy = spyOn(fundDataStorageService, 'getData');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fundDataStorageService.getData on ionViewWillEnter', async (done) => {
    fundDataStorageServiceSpy
      .withArgs('fundStopLoss')
      .and.returnValue(Promise.resolve(null))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(false));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture
      .whenStable()
      .then(() => expect(fundDataStorageServiceSpy).toHaveBeenCalledTimes(2));
    done();
  });

  it('should call apiFunds.renewFund on handleSubmit', async (done) => {
    fundDataStorageServiceSpy
      .withArgs('fundStopLoss')
      .and.returnValue(Promise.resolve(formData.valid))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(true));
    component.ionViewWillEnter();
    const spy = spyOn(apiFundsService, 'renewFund');
    spy.and.returnValue(of({}));
    component.handleSubmit(formData.valid);
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });

  it('should call apiFunds.crud.create on handleSubmit', async (done) => {
    fundDataStorageServiceSpy
      .withArgs('fundStopLoss')
      .and.returnValue(Promise.resolve(null))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(false));
    component.ionViewWillEnter();
    const spy = spyOn(apiFundsService.crud, 'create');
    spy.and.returnValue(of({}));
    component.handleSubmit(formData.valid);
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });
});
