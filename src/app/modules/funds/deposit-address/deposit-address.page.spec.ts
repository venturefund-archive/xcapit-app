import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositAddressPage } from './deposit-address.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';

describe('DepositAddressPage', () => {
  let component: DepositAddressPage;
  let fixture: ComponentFixture<DepositAddressPage>;
  let apiFundsServiceMock: any;
  let apiFundsService: ApiFundsService;
  const depositAddressData = {
    address: 'asd',
    success: true,
    addressTag: '',
    asset: 'BTC',
    url: 'https://123.com'
  };
  let clipboardServiceSpy: any;
  beforeEach(async(() => {
    apiFundsServiceMock = {
      getDepositAdress: () => of(depositAddressData)
    };
    clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', ['copy']);
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        IonicModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [DepositAddressPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiFundsService, useValue: apiFundsServiceMock },
        { provide: ClipboardService, useValue: clipboardServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.get(ApiFundsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDepositAdress on form changes', () => {
    const spy = spyOn(apiFundsService, 'getDepositAdress');
    spy.and.returnValue(of(depositAddressData));
    component.ionViewDidEnter();
    component.form.get('currency').setValue('BTC');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('should call copy in ClipboardService when call copyToClipboard', () => {
    const spy = spyOn(apiFundsService, 'getDepositAdress');
    spy.and.returnValue(of(depositAddressData));
    component.ionViewDidEnter();
    component.form.get('currency').setValue('BTC');
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        component.copyToClipboard();
        expect(clipboardServiceSpy.copy).toHaveBeenCalledTimes(1);
      });
  });
});
