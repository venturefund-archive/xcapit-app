import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundStopLossPage } from './fund-stop-loss.page';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { of } from 'rxjs';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

const formData = {
  valid: {
    stop_loss: 15
  },
  invalid: {
    stop_loss: ''
  }
};

describe('FundStopLossPage', () => {
  let component: FundStopLossPage;
  let fixture: ComponentFixture<FundStopLossPage>;
  let fundDataStorageServiceMock: any;
  let fundDataStorageService: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundStopLossPage>;
  let apiFundsMock: any;
  let apiFundsService: any;
  let modalControllerSpy: any;
  let navControllerSpy: any;

  beforeEach(async(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', [
      'navigateForward'
    ]);
    navControllerSpy.navigateForward.and.returnValue(of({}).toPromise());

    fundDataStorageServiceMock = {
      getData: () => Promise.resolve({}),
      setData: () => Promise.resolve({}),
      getFund: () => Promise.resolve({}),
      clearAll: () => Promise.resolve({})
    };
    apiFundsMock = {
      crud: {
        create: () => of()
      },
      getMostChosenSL: () => of(10)
    };
    modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);

    TestBed.configureTestingModule({
      declarations: [FundStopLossPage, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'funds/fund-success',
            component: DummyComponent
          }
        ]),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        IonicModule
      ],
      providers: [
        {
          provide: FundDataStorageService,
          useValue: fundDataStorageServiceMock
        },
        {
          provide: ApiFundsService,
          useValue: apiFundsMock
        },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundStopLossPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fundDataStorageService = TestBed.get(FundDataStorageService);
    apiFundsService = TestBed.get(ApiFundsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fundDataStorageService.getData on init', async done => {
    const spy = spyOn(fundDataStorageService, 'getData');
    spy.and.returnValue(Promise.resolve({}));
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });

  it('should call apiFunds.crud.create on handleSubmit and form valid', async done => {
    const spy = spyOn(apiFundsService.crud, 'create');
    spy.and.returnValue(of({}));
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    component.handleSubmit();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });

  it('should not call apiFunds.crud.create on handleSubmit and form invalid', async done => {
    const spy = spyOn(apiFundsService.crud, 'create');
    spy.and.returnValue(of({}));
    component.form.patchValue(formData.invalid);
    component.handleSubmit();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(0));
    done();
  });

  it('should call apiFunds.getMostChosenSL on getMostChosenSL', () => {
    const spy = spyOn(apiFundsService, 'getMostChosenSL');
    spy.and.returnValue(of(15));
    component.getMostChosenSL();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call modal.present on openCustomSL', () => {
    component.openCustomSL();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Create Fund button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Create Fund'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });


  it('should call trackEvent on trackService when Edit Custom Stop Loss button clicked', () => {
    component.stopLossOptions = [
      {
        name: '+35%',
        value: 35,
        custom: true
      }
    ];
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Edit Custom Stop Loss'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
