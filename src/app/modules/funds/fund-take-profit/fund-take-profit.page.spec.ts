import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTakeProfitPage } from './fund-take-profit.page';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { of } from 'rxjs';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { DummyComponent } from 'src/testing/dummy.component.spec';
const formData = {
  valid: {
    take_profit: 15
  },
  invalid: {
    take_profit: ''
  }
};
describe('FundTakeProfitPage', () => {
  let component: FundTakeProfitPage;
  let fixture: ComponentFixture<FundTakeProfitPage>;
  let fundDataStorageServiceMock;
  let fundDataStorageService;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundTakeProfitPage>;
  let apiFundsMock;
  let apiFundsService;
  let modalControllerMock: any;
  let modalControllerService;

  beforeEach(async(() => {
    fundDataStorageServiceMock = {
      getData: () => Promise.resolve({}),
      setData: () => Promise.resolve()
    };
    apiFundsMock = {
      getMostChosenTP: () => of(15)
    };
    modalControllerMock = {
      create: of({
        present: () => {},
        onDidDismiss: () => of({}).toPromise()
      }).toPromise(),
      dismiss: of().toPromise()
    };

    TestBed.configureTestingModule({
      declarations: [FundTakeProfitPage, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'funds/fund-stop-loss',
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
        { provide: ModalController, useValue: modalControllerMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundTakeProfitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fundDataStorageService = TestBed.get(FundDataStorageService);
    apiFundsService = TestBed.get(ApiFundsService);
    modalControllerService = TestBed.get(ModalController);
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

  it('should call fundDataStorageService.setData on handleSubmit and form valid', async done => {
    const spy = spyOn(fundDataStorageService, 'setData');
    spy.and.returnValue(Promise.resolve());
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });

  it('should not call fundDataStorageService.setData on handleSubmit and form invalid', async done => {
    const spy = spyOn(fundDataStorageService, 'setData');
    spy.and.returnValue(Promise.resolve());
    component.form.patchValue(formData.invalid);
    component.handleSubmit();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(0));
    done();
  });

  it('should call apiFunds.getMostChosenTP on getMostChosenTP', () => {
    const spy = spyOn(apiFundsService, 'getMostChosenTP');
    spy.and.returnValue(of(15));
    component.getMostChosenTP();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call modal.present on openCustomTP', async done => {
    const spy = spyOn(modalControllerService, 'create');
    spy.and.returnValue(
      of({
        present: () => {},
        onDidDismiss: () => of({}).toPromise()
      }).toPromise()
    );
    component.openCustomTP();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });

  it('should call trackEvent on trackService when Back button clicked', () => {
    const spyModal = spyOn(modalControllerService, 'create');
    spyModal.and.returnValue(
      of({
        present: () => {},
        onDidDismiss: () => of({}).toPromise()
      }).toPromise()
    );
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Back'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Save Fund Take Profit button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Save Fund Take Profit'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Edit Custom Take Profit button clicked', () => {
    const spyModal = spyOn(modalControllerService, 'create');
    spyModal.and.returnValue(
      of({
        present: () => {},
        onDidDismiss: () => of({}).toPromise()
      }).toPromise()
    );
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-radio',
      'Edit Custom Take Profit'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
