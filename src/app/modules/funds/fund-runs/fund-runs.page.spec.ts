import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundRunsPage } from './fund-runs.page';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StateShowNamePipe } from '../shared-funds/pipes/state-names/state-names.pipe';

describe('FundRunsPage', () => {
  let component: FundRunsPage;
  let fixture: ComponentFixture<FundRunsPage>;
  let apiFundsServiceMock: any;
  let apiFundsService: ApiFundsService;

  beforeEach(async(() => {
    apiFundsServiceMock = {
      getFundRuns: () => of([])
    };
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        IonicModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ FundRunsPage, StateShowNamePipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiFundsService, useValue: apiFundsServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundRunsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.get(ApiFundsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFundRuns in apiFundsService', () => {
    const spy = spyOn(apiFundsService, 'getFundRuns');
    spy.and.returnValue(of(null));
    component.ionViewDidEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
