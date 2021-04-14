import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FundListSubHeaderComponent } from './fund-list-sub-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbsoluteValuePipe } from '../../../shared-funds/pipes/absolute-value/absolute-value.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiFundsService } from '../../../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HideTextPipe } from 'src/app/shared/pipes/hide-text/hide-text.pipe';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { Storage } from '@ionic/storage';

describe('FundListSubHeaderComponent', () => {
  let component: FundListSubHeaderComponent;
  let fixture: ComponentFixture<FundListSubHeaderComponent>;
  let apiFunds: ApiFundsService;
  let apiFundsMock: any;
  let storage: any;
  let localStorageService: LocalStorageService;
  let localStorageServiceMock: any;

  beforeEach(
    waitForAsync(() => {
      localStorageServiceMock = {
        toggleHideFunds: () => undefined,
        getHideFunds: () => Promise.resolve(true),
      };
      apiFundsMock = {
        getTotalBalance: () => of({}),
      };

      TestBed.configureTestingModule({
        declarations: [
          FundListSubHeaderComponent,
          AbsoluteValuePipe,
          HideTextPipe,
        ],

        imports: [
          IonicModule,
          TranslateModule.forRoot(),
          HttpClientTestingModule,
        ],
        providers: [
          { provide: Storage, useValue: storage },
          { provide: ApiFundsService, useValue: apiFundsMock },
          { provide: LocalStorageService, useValue: localStorageServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(FundListSubHeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      apiFunds = TestBed.inject(ApiFundsService);
    })
  );

  beforeEach(() => {
    localStorageService = TestBed.inject(LocalStorageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call get on apiFunds.getTotalBalance when ngOnInit', () => {
    const spy = spyOn(apiFunds, 'getTotalBalance');
    spy.and.returnValue(of({}));
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should call SubscribeOnHideFunds on ionViewWillEnter', () => {
    const spy = spyOn(component, 'subscribeOnHideFunds');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call toggleHideFunds in HideText', () => {
    const spyToggle = spyOn(localStorageService, 'toggleHideFunds');
    spyToggle.and.returnValue(undefined);
    component.hideText();
    expect(localStorageService.toggleHideFunds).toHaveBeenCalledTimes(1);
  });
});
