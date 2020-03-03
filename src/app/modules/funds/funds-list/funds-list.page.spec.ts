import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsListPage } from './funds-list.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { LogsService } from 'src/app/shared/services/logs/logs.service';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { DummyComponent } from 'src/testing/dummy.component.spec';

describe('FundsListPage', () => {
  let component: FundsListPage;
  let fixture: ComponentFixture<FundsListPage>;
  let apiFundsServiceMock: any;
  let apiFundsService: ApiFundsService;
  let logsServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundsListPage>;

  beforeEach(async(() => {
    logsServiceMock = {
      log: () => of({})
    };

    apiFundsServiceMock = {
      getFundBalances: () => of([])
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        IonicModule,
        RouterTestingModule.withRoutes([
          {
            path: 'tutorials/interactive-tutorial',
            component: DummyComponent
          }
        ])
      ],
      declarations: [FundsListPage, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        TrackClickDirective,
        {
          provide: LogsService,
          useValue: logsServiceMock
        },
        {
          provide: ApiFundsService,
          useValue: apiFundsServiceMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.get(ApiFundsService);
    logsServiceMock = TestBed.get(LogsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFundBalances in apiFundsService', () => {
    const spy = spyOn(apiFundsService, 'getFundBalances');
    spy.and.returnValue(of([]));
    component.ionViewDidEnter();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should call trackEvent on trackService when Go To Profile button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Go To Profile'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Show Notifications button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Show Notifications'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
