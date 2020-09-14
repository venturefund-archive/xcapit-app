import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { FundListSubHeaderComponent } from './fund-list-sub-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbsoluteValuePipe } from '../../../shared-funds/pipes/absolute-value/absolute-value.pipe';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiFundsService } from '../../../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

describe('FundListSubHeaderComponent', () => {
  let component: FundListSubHeaderComponent;
  let fixture: ComponentFixture<FundListSubHeaderComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundListSubHeaderComponent>;
  let apiFunds: ApiFundsService;
  let apiFundsMock: any;
  let modalControllerSpy: any;
  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );
    apiFundsMock = {
      getTotalBalance: () => of({})
    };

    TestBed.configureTestingModule({
      declarations: [
        FundListSubHeaderComponent,
        AbsoluteValuePipe,
        TrackClickDirective
      ],

      imports: [
        IonicModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        { provide: ApiFundsService, useValue: apiFundsMock },
        {
          provide: ModalController,
          useValue: modalControllerSpy
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FundListSubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    apiFunds = TestBed.get(ApiFundsService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Change Total Currency button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Change Total Currency'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call get on apiFunds.getTotalBalance when ngOnInit', () => {
    const spy = spyOn(apiFunds, 'getTotalBalance');
    spy.and.returnValue(of({}));
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
