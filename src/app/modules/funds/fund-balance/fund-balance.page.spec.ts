import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundBalancePage } from './fund-balance.page';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyEndBalancePipe } from './pipes/currency-end-balance/currency-end-balance.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { CurrencyTextPipe } from '../shared-funds/pipes/currency-text/currency-text.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { IonicModule } from '@ionic/angular';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FundBalancePage', () => {
  let component: FundBalancePage;
  let fixture: ComponentFixture<FundBalancePage>;
  let apiFundServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundBalancePage>;

  beforeEach(async(() => {
    apiFundServiceSpy = jasmine.createSpyObj('ApiFundsService', ['getBalance']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        IonicModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule
      ],
      declarations: [
        FundBalancePage,
        CurrencyEndBalancePipe,
        CurrencyTextPipe,
        TrackClickDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiFundsService, useValue: apiFundServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundBalancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFundBalance on ionViewDidEnter', () => {
    const getFundBalanceSpy = spyOn(component, 'getFundBalance');
    component.ionViewDidEnter();
    fixture.detectChanges();
    expect(getFundBalanceSpy).toHaveBeenCalledTimes(1);
  });

  it('should call getBalance on getFundBalance is callled', () => {
    apiFundServiceSpy.getBalance.and.returnValue(of({}));
    component.ionViewDidEnter();
    fixture.detectChanges();
    expect(apiFundServiceSpy.getBalance).toHaveBeenCalledTimes(1);
  });

  describe('with fund balance', () => {
    beforeEach(() => {
      component.fundBalance = { fund: { id_corrida: 1 }, balance: {} };
      fixture.detectChanges();
    });

    it('should call trackEvent on trackService when ChanginCa is clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName(
        'ion-button',
        'ChanginCa'
      );
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spyClickEvent = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
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
  });
});
