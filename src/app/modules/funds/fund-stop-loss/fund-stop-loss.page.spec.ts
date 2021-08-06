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
import { modalControllerMock } from '../../../../testing/spies/modal-controller-mock.spec';
import { StorageApikeysService } from '../../apikeys/shared-apikeys/services/storage-apikeys/storage-apikeys.service';

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
  let storageApikeysService: StorageApikeysService;
  let storageApikeysServiceMock: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
      navControllerSpy.navigateForward.and.returnValue(Promise.resolve());
      storageApikeysServiceMock = {
        data: {},
      };
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
          { provide: FundDataStorageService, useValue: fundDataStorageServiceMock },
          { provide: ApiFundsService, useValue: apiFundsMock },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: StorageApikeysService, useValue: storageApikeysServiceMock },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundStopLossPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fundDataStorageService = TestBed.inject(FundDataStorageService);
    apiFundsService = TestBed.inject(ApiFundsService);
    fundDataStorageServiceSpy = spyOn(fundDataStorageService, 'getData');
    storageApikeysService = TestBed.inject(StorageApikeysService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fundDataStorageService.getData on ionViewWillEnter', async () => {
    fundDataStorageServiceSpy
      .withArgs('fundStopLoss')
      .and.returnValue(Promise.resolve(null))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(false));
    component.ionViewWillEnter();
    expect(fundDataStorageServiceSpy).toHaveBeenCalledTimes(2);
  });

  it('should call apiFunds.renewFund on handleSubmit', async () => {
    fundDataStorageServiceSpy
      .withArgs('fundStopLoss')
      .and.returnValue(Promise.resolve(formData.valid))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(true));
    component.ionViewWillEnter();
    const spy = spyOn(apiFundsService, 'renewFund');
    spy.and.returnValue(of({}));
    await component.handleSubmit(formData.valid);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call apiFunds.crud.create on handleSubmit', async () => {
    storageApikeysService.data = { id: 1, alias: '', nombre_bot: '' };
    fundDataStorageServiceSpy
      .withArgs('fundStopLoss')
      .and.returnValue(Promise.resolve(null))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(false));
    component.ionViewWillEnter();
    const spy = spyOn(apiFundsService.crud, 'create');
    spy.and.returnValue(of({}));
    await component.handleSubmit(formData.valid);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
