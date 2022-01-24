import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { DepositAddressPage } from './deposit-address.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiDaService } from '../shared-deposit-addresses/services/api-da.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { LogsService } from 'src/app/shared/services/logs/logs.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

describe('DepositAddressPage', () => {
  let component: DepositAddressPage;
  let fixture: ComponentFixture<DepositAddressPage>;
  let apiDaServiceMock: any;
  let apiDaService: ApiDaService;
  let logsServiceMock: any;
  let activatedRouteSpy: any;
  const depositAddressData = {
    address: 'asd',
    success: true,
    addressTag: '',
    asset: 'BTC',
    url: 'https://1234.com',
  };
  let clipboardServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DepositAddressPage>;
  let toastServiceSpy: any;

  beforeEach(
    waitForAsync(() => {
      toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
      apiDaServiceMock = {
        getDepositAddress: () => of(depositAddressData),
      };
      logsServiceMock = {
        log: () => of({}),
      };
      clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', ['write']);
      clipboardServiceSpy.write.and.returnValue(Promise.resolve());
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
      activatedRouteSpy.snapshot = {
        paramMap: convertToParamMap({
          currency: 'BTC',
        }),
      };
      TestBed.configureTestingModule({
        declarations: [DepositAddressPage, FakeTrackClickDirective, DummyComponent],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          ReactiveFormsModule,
          IonicModule,
          RouterTestingModule.withRoutes([{ path: 'tabs/home', component: DummyComponent }]),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: ApiDaService, useValue: apiDaServiceMock },
          { provide: LogsService, useValue: logsServiceMock },
          { provide: ClipboardService, useValue: clipboardServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: ToastService, useValue: toastServiceSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiDaService = TestBed.inject(ApiDaService);
    logsServiceMock = TestBed.inject(LogsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDepositAdress on ionViewWillEnter', async () => {
    const spy = spyOn(apiDaService, 'getDepositAddress');
    spy.and.returnValue(of(depositAddressData));
    component.ionViewWillEnter();
    component.currency = 'BTC';
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe('Deposit Address loaded', () => {
    beforeEach(() => {
      const spy = spyOn(apiDaService, 'getDepositAddress');
      spy.and.returnValue(of(depositAddressData));
      component.ionViewWillEnter();
      component.currency = 'BTC';
      fixture.detectChanges();
    });

    it('should call write in ClipboardService when call copyToClipboard', async () => {
      clipboardServiceSpy.write.and.returnValue(of({}).toPromise());
      component.copyToClipboard();
      expect(clipboardServiceSpy.write).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when Copy Deposit Address is clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Copy Deposit Address');
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spyClickEvent = spyOn(directive, 'clickEvent');
      clipboardServiceSpy.write.and.returnValue(of({}).toPromise());
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when Open URL Deposit Address is clicked', () => {
      spyOn(window, 'open');
      const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Open URL Deposit Address');
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spyClickEvent = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when back to home is clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Back Home');
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spyClickEvent = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });
  });
});
