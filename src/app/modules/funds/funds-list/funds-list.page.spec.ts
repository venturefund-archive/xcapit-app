import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsListPage } from './funds-list.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';

describe('FundsListPage', () => {
  let component: FundsListPage;
  let fixture: ComponentFixture<FundsListPage>;
  let apiFundsServiceMock: any;
  let apiFundsService: ApiFundsService;

  beforeEach(async(() => {
    apiFundsServiceMock = {
      getSubscribedFunds: () => of([])
    };
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        IonicModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ FundsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiFundsService, useValue: apiFundsServiceMock}
      ]
    })
    .compileComponents();
  }));



  beforeEach(() => {
    fixture = TestBed.createComponent(FundsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.get(ApiFundsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSubscribedFunds in apiFundsService', () => {
    const spy = spyOn(apiFundsService, 'getSubscribedFunds');
    spy.and.returnValue(of(null));
    component.ionViewDidEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
