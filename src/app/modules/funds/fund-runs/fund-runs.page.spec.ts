import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FundRunsPage } from './fund-runs.page';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StateShowNamePipe } from '../shared-funds/pipes/state-names/state-names.pipe';
import { LogsService } from 'src/app/shared/services/logs/logs.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

describe('FundRunsPage', () => {
  let component: FundRunsPage;
  let fixture: ComponentFixture<FundRunsPage>;
  let apiFundsServiceMock: any;
  let apiFundsService: ApiFundsService;
  let logsServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundRunsPage>;
  let modalControllerSpy: any;
  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );

    apiFundsServiceMock = {
      getFundRuns: () => of([])
    };
    logsServiceMock = {
      log: () => of({})
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        IonicModule,
        RouterTestingModule.withRoutes([
          { path: 'runs/run-summary/:id', component: DummyComponent }
        ])
      ],
      declarations: [FundRunsPage, StateShowNamePipe, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: LogsService, useValue: logsServiceMock },
        { provide: ApiFundsService, useValue: apiFundsServiceMock },
        { provide: ModalController, useValue: modalControllerSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundRunsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.inject(ApiFundsService);
    logsServiceMock = TestBed.inject(LogsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
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

  it('should call trackEvent on trackService when View Runs Detail is clicked', () => {
    component.fundRuns = [{ id: 1, id_corrida: 1, estado: 'active' }];
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'View Runs Detail'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
