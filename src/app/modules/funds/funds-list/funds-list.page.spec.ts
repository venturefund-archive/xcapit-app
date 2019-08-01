import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsListPage } from './funds-list.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { LogsService } from 'src/app/shared/services/logs/logs.service';

describe('FundsListPage', () => {
  let component: FundsListPage;
  let fixture: ComponentFixture<FundsListPage>;
  let apiFundsServiceMock: any;
  let apiFundsService: ApiFundsService;
  let logsServiceMock: any;
  beforeEach(async(() => {
    logsServiceMock = {
      log: () => of({})
    };
    apiFundsServiceMock = {
      getSubscribedFunds: () => of([])
    };
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        IonicModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [FundsListPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: LogsService, useValue: logsServiceMock },
        { provide: ApiFundsService, useValue: apiFundsServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.get(ApiFundsService);
    logsServiceMock = TestBed.get(LogsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSubscribedFunds in apiFundsService', () => {
    const spy = spyOn(apiFundsService, 'getSubscribedFunds');
    spy.and.returnValue(of([]));
    component.ionViewDidEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call log on ionViewDidEnter', () => {
    const spy = spyOn(logsServiceMock, 'log');
    spy.and.returnValue(of({}));
    component.ionViewDidEnter();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
