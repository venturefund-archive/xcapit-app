import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFundPage } from './new-fund.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

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

describe('NewFundPage', () => {
  let component: NewFundPage;
  let fixture: ComponentFixture<NewFundPage>;
  let apiFundsServiceMock: any;
  let apiFundsService: ApiFundsService;
  let modalControllerSpy: any;
  let modalController: ModalController;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    modalControllerSpy.create.and.returnValue(of(null).toPromise());
    apiFundsServiceMock = {
      crud: {
        create: () => of({})
      }
    };
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        IonicModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ NewFundPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiFundsService, useValue: apiFundsServiceMock},
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.get(ApiFundsService);
    modalController = TestBed.get(ModalController);
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

  describe('Form values', () => {
    it('form should be valid when all fields are ok', async () => {
      component.form.patchValue(formData);
      expect(component.form.valid).toBeTruthy();
    });

    it('form should be invalid when fields are empty', async () => {
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be invalid when some fields are notvalid', async () => {
      component.form.patchValue(formData);
      component.form.get('currency').setValue('');
      expect(component.form.valid).toBeFalsy();
    });
  });
});
