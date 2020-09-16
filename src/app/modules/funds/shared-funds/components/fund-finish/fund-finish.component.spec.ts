import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { FundFinishComponent } from './fund-finish.component';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';
import { of } from 'rxjs';
import { DummyComponent } from '../../../../../../testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TrackClickDirective } from '../../../../../shared/directives/track-click/track-click.directive';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FundFinishPauseCardComponent', () => {
  let component: FundFinishComponent;
  let fixture: ComponentFixture<FundFinishComponent>;
  let apiFundsServiceMock: any;
  let apiFundsService: ApiFundsService;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundFinishComponent>;
  let toastService: ToastService;
  let navControllerMock: any;
  let navController: NavController;
  let toastServiceSpy: any;

  beforeEach(async(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', [
      'showToast',
    ]);
    apiFundsServiceMock = {
      finalizeFundRuns: () => of({})
    };
    navControllerMock = {
      navigateBack: () => Promise.resolve(true)
    };
    TestBed.configureTestingModule({
      declarations: [FundFinishComponent, TrackClickDirective, DummyComponent],
      imports: [
        IonicModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'tabs/funds',
            component: DummyComponent
          }
        ])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        TrackClickDirective,
        { provide: NavController, useValue: navControllerMock },
        {
          provide: ApiFundsService,
          useValue: apiFundsServiceMock
        },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FundFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.inject(ApiFundsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    toastService = TestBed.inject(ToastService);
    navController = TestBed.inject(NavController);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call finalizeFundRuns when finishFund is called', () => {
    const spy = spyOn(apiFundsService, 'finalizeFundRuns');
    spy.and.returnValue(of({}));
    component.finishFund();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call navController.navigateBack when successFinish is called', () => {
    const spy = spyOn(navController, 'navigateBack');
    spy.and.returnValue(Promise.resolve(true));
    component.successFinish();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call toastService.showToast when showToast is called', () => {
    component.showToast();
    expect(toastServiceSpy.showToast).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Finish Fund button clicked', () => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Finish Fund'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
