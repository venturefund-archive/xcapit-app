import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTakeProfitPage } from './fund-take-profit.page';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { of } from 'rxjs';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
const formData = {
  valid: {
    take_profit: 15
  },
  invalid: {
    take_profit: ''
  }
};
describe('FundTakeProfitPage', () => {
  let component: FundTakeProfitPage;
  let fixture: ComponentFixture<FundTakeProfitPage>;
  let fundDataStorageServiceMock;
  let fundDataStorageService;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundTakeProfitPage>;
  let apiFundsMock: any;
  let apiFundsService: any;
  let modalControllerSpy: any;
  let navControllerSpy: any;

  beforeEach(waitForAsync(() => {
    fundDataStorageServiceMock = {
      getData: () => Promise.resolve({}),
      setData: () => Promise.resolve()
    };
    apiFundsMock = {
      getMostChosenTP: () => of(15)
    };
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);


    TestBed.configureTestingModule({
      declarations: [FundTakeProfitPage, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'funds/fund-stop-loss',
            component: DummyComponent
          }
        ]),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        IonicModule
      ],
      providers: [
        {
          provide: FundDataStorageService,
          useValue: fundDataStorageServiceMock
        },
        {
          provide: ApiFundsService,
          useValue: apiFundsMock
        },
        {
          provide: NavController,
          useValue: navControllerSpy
        },
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundTakeProfitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fundDataStorageService = TestBed.inject(FundDataStorageService);
    apiFundsService = TestBed.inject(ApiFundsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fundDataStorageService.getData on ionViewWillEnter', async done => {
    const spy = spyOn(fundDataStorageService, 'getData');
    spy.and.returnValue(Promise.resolve({}));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(2));
    done();
  });

  it('should call fundDataStorageService.setData on handleSubmit and form valid', async done => {
    const spy = spyOn(fundDataStorageService, 'setData');
    spy.and.returnValue(Promise.resolve());
    component.handleSubmit(formData.valid);
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });
});
