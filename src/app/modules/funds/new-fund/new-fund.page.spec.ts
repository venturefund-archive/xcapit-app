import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFundPage } from './new-fund.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { FundFormActions } from '../shared-funds/enums/fund-form-actions.enum';
import { FundActionFormTitlePipe } from './pipes/fund-action-form-title/fund-action-form-title.pipe';
import { FundActionFormTextButtonPipe } from './pipes/fund-action-form-text-button/fund-action-form-text-button.pipe';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const formData = {
  api_key: 'asdfad',
  secret_key: 'asdfasdfa',
  fund_name: 'Test1',
  currency: 'BTC',
  cantidad_dias: '30',
  take_profit: '30',
  stop_loss: '32',
  risk_level: 'PRO'
};

const formDataRenew = {
  // fund_name: 'Test1',
  currency: 'BTC',
  cantidad_dias: '30',
  take_profit: '30',
  stop_loss: '32',
  risk_level: 'PRO'
};

describe('NewFundPage', () => {
  let component: NewFundPage;
  let fixture: ComponentFixture<NewFundPage>;
  let apiFundsServiceMock: any;
  let apiFundsService: ApiFundsService;
  let modalControllerSpy: any;
  let activatedRouteSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<NewFundPage>;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    modalControllerSpy.create.and.returnValue(of({ present: () => {} }).toPromise());
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
    apiFundsServiceMock = {
      crud: {
        create: () => of({}),
        update: () => of({})
      },
      renewFund: () => of({}),
      getFundRuns: () => of({})
    };
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        IonicModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        NewFundPage,
        FundActionFormTitlePipe,
        FundActionFormTextButtonPipe,
        TrackClickDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        TrackClickDirective,
        { provide: ApiFundsService, useValue: apiFundsServiceMock },
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFundPage);
    component = fixture.componentInstance;
    apiFundsService = TestBed.get(ApiFundsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should open API Keys Tutorial', () => {
    component.openAPIKeysTutorial().then(() => {
      fixture.detectChanges();
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
  });

  it('should call save on submit form', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'save');
    fixture.debugElement
      .query(By.css('form'))
      .triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call create on apiFunds.crud, valid form', () => {
    TestBed.get(ActivatedRoute).snapshot = {
      paramMap: convertToParamMap({
        action: FundFormActions.NewFund,
        fundName: ''
      })
    };
    component.form.patchValue(formData);
    fixture.detectChanges();
    const spy = spyOn(apiFundsService.crud, 'create');
    spy.and.returnValue(of(null));
    component.save();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call create on apiFunds.crud, invalid form', () => {
    component.form.patchValue(formData);
    component.form.get('currency').setValue('');
    fixture.detectChanges();
    const spy = spyOn(apiFundsService.crud, 'create');
    spy.and.returnValue(of(null));
    component.save();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call create when action is NewFund', () => {
    TestBed.get(ActivatedRoute).snapshot = {
      paramMap: convertToParamMap({
        action: FundFormActions.NewFund,
        fundName: ''
      })
    };
    fixture.detectChanges();
    component.form.patchValue(formData);
    const spy = spyOn(apiFundsService.crud, 'create');
    spy.and.returnValue(of({}));
    component.save();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call renewFund when action is RenewFund', () => {
    TestBed.get(ActivatedRoute).snapshot = {
      paramMap: convertToParamMap({
        action: FundFormActions.RenewFund,
        fundName: 'fundName'
      })
    };
    fixture.detectChanges();
    component.form.patchValue(formDataRenew);
    const spy = spyOn(apiFundsService, 'renewFund');
    spy.and.returnValue(of({}));
    component.save();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call update & getFundRuns when action is EditProfitLoss', () => {
    const getFundRunSpy = spyOn(apiFundsService, 'getFundRuns');
    getFundRunSpy.and.returnValue(of([{ id_corrida: 1 }]));
    TestBed.get(ActivatedRoute).snapshot = {
      paramMap: convertToParamMap({
        action: FundFormActions.EditProfitLoss,
        fundName: 'fundName'
      })
    };
    fixture.detectChanges();
    component.form.patchValue(formDataRenew);
    const updateSpy = spyOn(apiFundsService.crud, 'update');
    updateSpy.and.returnValue(of({}));
    component.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(getFundRunSpy).toHaveBeenCalledTimes(1);
  });

  describe('Form values', () => {
    it('form should be valid on new when all fields are ok', async () => {
      TestBed.get(ActivatedRoute).snapshot = {
        paramMap: convertToParamMap({
          action: FundFormActions.NewFund
        })
      };
      fixture.detectChanges();
      component.form.patchValue(formData);
      expect(component.form.valid).toBeTruthy();
    });

    it('form should be valid on new when all fields (with trailing) are ok', async () => {
      TestBed.get(ActivatedRoute).snapshot = {
        paramMap: convertToParamMap({
          action: FundFormActions.NewFund
        })
      };
      fixture.detectChanges();
      component.toggleTrailing({ detail: { checked: true } } as CustomEvent);
      component.form.patchValue(formData);
      expect(component.form.valid).toBeTruthy();
    });

    it('form should be invalid on new when all fields (with trailing) are not ok', async () => {
      TestBed.get(ActivatedRoute).snapshot = {
        paramMap: convertToParamMap({
          action: FundFormActions.NewFund
        })
      };
      fixture.detectChanges();
      component.toggleTrailing({ detail: { checked: true } } as CustomEvent);
      component.form.patchValue(formData);
      component.form.get('trailing_stop').setValue(null);
      expect(component.form.valid).toBeFalsy();
      component.form.get('trailing_stop').setValue(1);
      component.form.get('trailing_profit').setValue(null);
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be valid on renew when all fields are ok', async () => {
      TestBed.get(ActivatedRoute).snapshot = {
        paramMap: convertToParamMap({
          action: FundFormActions.RenewFund,
          fundName: 'prueba'
        })
      };
      fixture = TestBed.createComponent(NewFundPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.form.patchValue(formDataRenew);
      expect(component.form.valid).toBeTruthy();
    });

    it('form should be invalid when fields are empty', async () => {
      fixture.detectChanges();
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be invalid when some fields are notvalid', async () => {
      fixture.detectChanges();
      activatedRouteSpy.params.and.returnValue(of({}));
      component.form.patchValue(formData);
      component.form.get('currency').setValue('');
      expect(component.form.valid).toBeFalsy();
    });
  });

  it('should call trackEvent on trackService when New Fund Form Info button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'New Fund Form Info'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Save Fund button clicked', () => {
    TestBed.get(ActivatedRoute).snapshot = {
      paramMap: convertToParamMap({
        action: FundFormActions.NewFund,
        fundName: ''
      })
    };
    fixture.detectChanges();
    component.form.patchValue(formData);
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Save Fund'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
