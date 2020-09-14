import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundSettingsPage } from './fund-settings.page';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../../testing/dummy.component.spec';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const fund = {
  nombre_bot: 'test',
  currency: 'USDT',
  ganancia: 10,
  perdida: 10
};
const ak = {
  ak: 'test_ak',
  secret: ''
};
describe('FundSettingsPage', () => {
  let component: FundSettingsPage;
  let fixture: ComponentFixture<FundSettingsPage>;
  let apiFundsServiceMock: any;
  let apiApiKeysServiceMock: any;
  let apiFundsService: ApiFundsService;
  let apiApiKeysService: ApiApikeysService;
  beforeEach(async(() => {
    apiFundsServiceMock = {
      getLastFundRun: () => of(fund)
    };
    apiApiKeysServiceMock = {
      getByFundName: () => of(ak)
    };
    TestBed.configureTestingModule({
      declarations: [FundSettingsPage, DummyComponent],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'funds/fund-detail',
            component: DummyComponent
          }
        ])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ApiFundsService,
          useValue: apiFundsServiceMock
        },
        {
          provide: ApiApikeysService,
          useValue: apiApiKeysServiceMock
        }]
    }).compileComponents();
    fixture = TestBed.createComponent(FundSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.get(ApiFundsService);
    apiApiKeysService = TestBed.get(ApiApikeysService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getLastFundRun in apiFundsService on ionViewWillEnter', () => {
    const spy = spyOn(apiFundsService, 'getLastFundRun');
    spy.and.returnValue(of(fund));
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getByFundName in ApiApikeysService on ionViewWillEnter', () => {
    const spy = spyOn(apiApiKeysService, 'getByFundName');
    spy.and.returnValue(of(ak));
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
