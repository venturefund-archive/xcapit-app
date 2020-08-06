import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FundFinishPauseCardComponent } from './fund-finish-pause-card.component';
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
  let component: FundFinishPauseCardComponent;
  let fixture: ComponentFixture<FundFinishPauseCardComponent>;
  let apiFundsServiceMock: any;
  let apiFundsService: ApiFundsService;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundFinishPauseCardComponent>;
  let toastServiceSpy: any;
  let toastService: ToastService;

  beforeEach(async(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    apiFundsServiceMock = {
      pauseFundRuns: () => of([]),
      resumeFundRuns: () => of({}),
      finalizeFundRuns: () => of({})
    };
    TestBed.configureTestingModule({
      declarations: [ FundFinishPauseCardComponent, TrackClickDirective, DummyComponent ],
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
        {
          provide: ApiFundsService,
          useValue: apiFundsServiceMock
        },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FundFinishPauseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.get(ApiFundsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    toastService = TestBed.get(ToastService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call pauseFundRuns in apiFundsService when pauseResumeFund and status is active', () => {
    component.status = 'active';
    fixture.detectChanges();
    const spy = spyOn(apiFundsService, 'pauseFundRuns');
    spy.and.returnValue(of({}));
    component.pauseResumeFund();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call resumeFundRuns in apiFundsService when pauseResumeFund and status is pausado', () => {
    component.status = 'pausado';
    fixture.detectChanges();
    const spy = spyOn(apiFundsService, 'resumeFundRuns');
    spy.and.returnValue(of({}));
    component.pauseResumeFund();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Pause or Resume Fund button clicked', () => {
    component.status = 'active';
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Pause or Resume Fund'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Finish Fund button clicked', () => {
    component.status = 'active';
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
