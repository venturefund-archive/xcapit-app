import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { FundFinishComponent } from './fund-finish.component';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';
import { of } from 'rxjs';
import { DummyComponent } from '../../../../../../testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';
import { alertControllerMock } from '../../../../../../testing/spies/alert-controller-mock.spec';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

describe('FundFinishPauseCardComponent', () => {
  let component: FundFinishComponent;
  let fixture: ComponentFixture<FundFinishComponent>;
  let apiFundsServiceMock: any;
  let apiFundsService: ApiFundsService;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundFinishComponent>;
  let toastService: ToastService;
  let navControllerSpy: any;
  let toastServiceSpy: any;
  let alertControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
      alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);

      apiFundsServiceMock = {
        finalizeFundRuns: () => of({}),
      };
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      navControllerSpy.navigateBack.and.returnValue(Promise.resolve(true));
      navControllerSpy.navigateForward.and.returnValue(Promise.resolve(true));
      navControllerSpy.navigateRoot.and.returnValue(Promise.resolve(true));
      TestBed.configureTestingModule({
        declarations: [FundFinishComponent, FakeTrackClickDirective, DummyComponent],
        imports: [
          IonicModule,
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([
            {
              path: 'tabs/funds',
              component: DummyComponent,
            },
          ]),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          {
            provide: ApiFundsService,
            useValue: apiFundsServiceMock,
          },
          { provide: ToastService, useValue: toastServiceSpy },
          { provide: AlertController, useValue: alertControllerSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FundFinishComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      apiFundsService = TestBed.inject(ApiFundsService);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      toastService = TestBed.inject(ToastService);
    })
  );

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
    component.successFinish();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(1);
  });

  it('should call toastService.showToast when showToast is called', () => {
    component.showToast();
    expect(toastServiceSpy.showToast).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Finish Fund button clicked', () => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Finish Fund');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
