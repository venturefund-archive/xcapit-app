import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundsFinishedPage } from './funds-finished.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';

describe('FundsFinishedPage', () => {
  let component: FundsFinishedPage;
  let fixture: ComponentFixture<FundsFinishedPage>;
  let fundDataStorageServiceMock;
  let fundDataStorageService;
  let apiFundsMock: any;
  let apiFundsService: any;
  const dataFunds = [
    {
      estado: 'finalizado',
      id_corrida: 1,
      nombre_bot: 'Test',
    },
  ];

  beforeEach(
    waitForAsync(() => {
      fundDataStorageServiceMock = {
        clearAll: () => Promise.resolve(),
      };
      apiFundsMock = {
        getFundsToRenew: () => of(dataFunds),
      };
      TestBed.configureTestingModule({
        declarations: [FundsFinishedPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          IonicModule,
          TranslateModule.forRoot(),
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([
            {
              path: 'tabs/investments/binance',
              component: DummyComponent,
            },
          ]),
        ],
        providers: [
          { provide: FundDataStorageService, useValue: fundDataStorageServiceMock },
          { provide: ApiFundsService, useValue: apiFundsMock },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsFinishedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fundDataStorageService = TestBed.inject(FundDataStorageService);
    apiFundsService = TestBed.inject(ApiFundsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fundDataStorageService.clearAll on init', async () => {
    const spy = spyOn(fundDataStorageService, 'clearAll');
    spy.and.returnValue(Promise.resolve({}));
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call apiFunds.getFundsToRenew on getFundsToRenew', () => {
    const spy = spyOn(apiFundsService, 'getFundsToRenew');
    spy.and.returnValue(of(dataFunds));
    component.getFundsToRenew();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
