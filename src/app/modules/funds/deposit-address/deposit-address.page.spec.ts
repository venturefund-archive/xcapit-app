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
import { LogsService } from 'src/app/shared/services/logs/logs.service';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

describe('DepositAddressPage', () => {
  let component: DepositAddressPage;
  let fixture: ComponentFixture<DepositAddressPage>;
  let apiFundsServiceMock: any;
  let apiFundsService: ApiFundsService;
  let logsServiceMock: any;
  const depositAddressData = {
    address: 'asd',
    success: true,
    addressTag: '',
    asset: 'BTC',
    url: 'https://123.com'
  };
  let clipboardServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<
    DepositAddressPage
  >;

  beforeEach(async(() => {
    apiFundsServiceMock = {
      getDepositAdress: () => of(depositAddressData)
    };
    logsServiceMock = {
      log: () => of({})
    };
    clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', ['copy']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        IonicModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [DepositAddressPage, TrackClickDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiFundsService, useValue: apiFundsServiceMock },
        { provide: LogsService, useValue: logsServiceMock },
        { provide: ClipboardService, useValue: clipboardServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.get(ApiFundsService);
    logsServiceMock = TestBed.get(LogsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
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
    fixture.whenStable().then(() => {
      component.copyToClipboard();
      expect(clipboardServiceSpy.copy).toHaveBeenCalledTimes(1);
    });
  });

  it('should call trackEvent on trackService when select is clicked', () => {
    const el = trackClickDirectiveHelper.getElement('ion-select');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when select is change', () => {
    const el = trackClickDirectiveHelper.getElement('ion-select');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'changeEvent');
    el.nativeElement.value = 'BTC';
    el.nativeElement.dispatchEvent(new Event('ionChange'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe('Currency Selected', () => {
    beforeEach(() => {
      const spy = spyOn(apiFundsService, 'getDepositAdress');
      spy.and.returnValue(of(depositAddressData));
      component.ionViewDidEnter();
      component.form.get('currency').setValue('BTC');
      fixture.detectChanges();
    });

    it('should call trackEvent on trackService when Copy Deposit Address is clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName(
        'ion-button',
        'Copy Deposit Address'
      );
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spyClickEvent = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when Open URL Deposit Address is clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName(
        'ion-button',
        'Open URL Deposit Address'
      );
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spyClickEvent = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });
  });
});
