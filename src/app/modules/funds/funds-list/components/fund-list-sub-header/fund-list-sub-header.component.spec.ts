import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FundListSubHeaderComponent } from './fund-list-sub-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbsoluteValuePipe } from '../../../shared-funds/pipes/absolute-value/absolute-value.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiFundsService } from '../../../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FundListSubHeaderComponent', () => {
  let component: FundListSubHeaderComponent;
  let fixture: ComponentFixture<FundListSubHeaderComponent>;
  let apiFunds: ApiFundsService;
  let apiFundsMock: any;
  beforeEach(waitForAsync(() => {
    apiFundsMock = {
      getTotalBalance: () => of({})
    };

    TestBed.configureTestingModule({
      declarations: [
        FundListSubHeaderComponent,
        AbsoluteValuePipe
      ],

      imports: [
        IonicModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        { provide: ApiFundsService, useValue: apiFundsMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FundListSubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFunds = TestBed.inject(ApiFundsService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call get on apiFunds.getTotalBalance when ngOnInit', () => {
    const spy = spyOn(apiFunds, 'getTotalBalance');
    spy.and.returnValue(of({}));
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
