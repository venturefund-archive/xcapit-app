import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FundInvestmentPage } from './fund-investment.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { alertControllerMock } from '../../../../testing/spies/alert-controller-mock.spec';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { of } from 'rxjs';
import { StorageApikeysService } from '../../apikeys/shared-apikeys/services/storage-apikeys/storage-apikeys.service';

const storageApiKeysData = { alias: '', nombre_bot: '', id: 1 };

describe('FundInvestmentPage', () => {
  let component: FundInvestmentPage;
  let fixture: ComponentFixture<FundInvestmentPage>;
  let fundDataStorageServiceMock;
  let fundDataStorageService;
  let apiApiKeysServiceMock;
  let apiApiKeysService: ApiApikeysService;
  let storageApiKeysServiceMock;
  let storageApiKeysService: StorageApikeysService;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundInvestmentPage>;
  let alertControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      fundDataStorageServiceMock = {
        getData: () => Promise.resolve(),
        setData: () => Promise.resolve(),
      };
      apiApiKeysServiceMock = {
        checkMinBalance: () =>
          of({
            min_balance: 500,
            balance_is_enough: true,
          }),
      };
      storageApiKeysServiceMock = {
        checkMinBalance: () =>
          of({
            min_balance: 500,
            balance_is_enough: true,
          }),
      };
      alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);
      TestBed.configureTestingModule({
        declarations: [FundInvestmentPage, TrackClickDirective, DummyComponent],
        imports: [
          TranslateModule.forRoot(),
          ReactiveFormsModule,
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([
            { path: 'funds/fund-name', component: DummyComponent },
            { path: 'funds/fund-take-profit', component: DummyComponent },
          ]),
          IonicModule,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: FundDataStorageService, useValue: fundDataStorageServiceMock },
          { provide: ApiApikeysService, useValue: apiApiKeysServiceMock },
          { provide: StorageApikeysService, useValue: storageApiKeysServiceMock },
          { provide: AlertController, useValue: alertControllerSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundInvestmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fundDataStorageService = TestBed.inject(FundDataStorageService);
    apiApiKeysService = TestBed.inject(ApiApikeysService);
    storageApiKeysService = TestBed.inject(StorageApikeysService);
    storageApiKeysService.data = storageApiKeysData;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fundDataStorageService.getData on init', async (done) => {
    const spy = spyOn(fundDataStorageService, 'getData');
    spy.and.returnValue(Promise.resolve('test'));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    done();
  });

  it('should save data and check balance on handleSubmit and form valid', async (done) => {
    const spyCheckBalance = spyOn(apiApiKeysService, 'checkMinBalance');
    spyCheckBalance.and.returnValue(
      of({
        min_balance: 500,
        balance_is_enough: true,
      })
    );
    const spy = spyOn(fundDataStorageService, 'setData');
    spy.and.returnValue(Promise.resolve());
    await component.handleSubmit({ risk_level: 'prueba', currency: 'USDT' });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spyCheckBalance).toHaveBeenCalledTimes(1);
    done();
  });

  it('should call alert and not save data when balance is not enough', async (done) => {
    const spyCheckBalance = spyOn(apiApiKeysService, 'checkMinBalance');
    spyCheckBalance.and.returnValue(
      of({
        min_balance: 500,
        balance_is_enough: false,
      })
    );
    const spy = spyOn(fundDataStorageService, 'setData');
    spy.and.returnValue(Promise.resolve());
    await component.handleSubmit({ risk_level: 'prueba', currency: 'USDT' });
    expect(spy).toHaveBeenCalledTimes(0);
    expect(spyCheckBalance).toHaveBeenCalledTimes(1);
    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
    done();
  });
});
