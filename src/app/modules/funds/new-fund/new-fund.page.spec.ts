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
  let modalController: ModalController;
  let activatedRouteSpy: any;
  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    modalControllerSpy.create.and.returnValue(of(null).toPromise());
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
    apiFundsServiceMock = {
      crud: {
        create: () => of({})
      },
      renewFund: () => of({})
    };
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        IonicModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [NewFundPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiFundsService, useValue: apiFundsServiceMock },
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.get(ApiFundsService);
    modalController = TestBed.get(ModalController);
    // activatedRouteSpy = TestBed.get(ActivatedRoute).params = of({ fund_name: 'prueba' });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open Binance API Keys Tutorial', () => {
    component.openBinanceAPIKeys().then(() => {
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });
  });

  it('should call save on submit form', () => {
    const spy = spyOn(component, 'save');
    fixture.debugElement
      .query(By.css('form'))
      .triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call create on apiFunds.crud, valid form', () => {
    TestBed.get(ActivatedRoute).snapshot = { paramMap: convertToParamMap({ })};
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

  it('should call create when isRenew is false', () => {
    // TestBed.get(ActivatedRoute).snapshot = { paramMap: convertToParamMap({ })};
    TestBed.get(ActivatedRoute).snapshot = { paramMap: convertToParamMap({ fund_name: 'prueba' })};
    // component.isRenew = false;
    fixture.detectChanges();
    component.form.patchValue(formData);
    const spy = spyOn(apiFundsService.crud, 'create');
    spy.and.returnValue(of({}));
    component.save();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  
  // TODO: Corregir test, hace que el proximo test falle.
  
  // it('should call renewFund when isRenew is true', () => {
  //   TestBed.get(ActivatedRoute).snapshot = { paramMap: convertToParamMap({ fund_name: 'prueba' })};
  //   component.isRenew = true;
  //   fixture.detectChanges();
  //   component.form.patchValue(formDataRenew);
  //   const spy = spyOn(apiFundsService, 'renewFund');
  //   spy.and.returnValue(of({}));
  //   component.save();
  //   expect(spy).toHaveBeenCalledTimes(1);
  // });

  describe('Form values', () => {
    it('form should be valid on new when all fields are ok', async () => {
      TestBed.get(ActivatedRoute).snapshot = { paramMap: convertToParamMap({})};
      component.form.patchValue(formData);
      expect(component.form.valid).toBeTruthy();
    });

    it('form should be valid on renew when all fields are ok', async () => {
      TestBed.get(ActivatedRoute).snapshot = { paramMap: convertToParamMap({ fund_name: 'prueba' })};
      fixture = TestBed.createComponent(NewFundPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.form.patchValue(formDataRenew);
      expect(component.form.valid).toBeTruthy();
    });

    it('form should be invalid when fields are empty', async () => {
      expect(component.form.valid).toBeFalsy();
    });
    it('form should be invalid when some fields are notvalid', async () => {
      activatedRouteSpy.params.and.returnValue(of({}));
      component.form.patchValue(formData);
      component.form.get('currency').setValue('');
      expect(component.form.valid).toBeFalsy();
    });
  });
});
