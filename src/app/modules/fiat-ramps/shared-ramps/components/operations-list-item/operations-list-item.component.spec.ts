import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TEST_COINS } from 'src/app/modules/wallets/shared-wallets/constants/coins.test';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { OPERATION_STATUS } from '../../constants/operation-status';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { OperationsListItemComponent } from './operations-list-item.component';

const cashIn: FiatRampOperation = 
{
  operation_id: 53,
  amount_in: 32,
  currency_in: 'ARS',
  amount_out: 21,
  currency_out: 'ETH',
  status: 'complete',
  created_at: new Date(),
  provider: '1',
  operation_type: 'cash-in',
  voucher: false,
};

const incompleteOperation: FiatRampOperation =
{
  operation_id: 55,
  amount_in: 32,
  currency_in: 'ARS',
  amount_out: 21,
  currency_out: 'ETH',
  status: 'wait',
  created_at: new Date(),
  provider: '1',
  operation_type: 'cash-in',
  voucher: false,
}

const inProgressOperation: FiatRampOperation =
{
  operation_id: 55,
  amount_in: 32,
  currency_in: 'ARS',
  amount_out: 21,
  currency_out: 'ETH',
  status: 'received',
  created_at: new Date(),
  provider: '1',
  operation_type: 'cash-in',
  voucher: false,
}

describe('OperationsListItemComponent', () => {
  let component: OperationsListItemComponent;
  let fixture: ComponentFixture<OperationsListItemComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<OperationsListItemComponent>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;

  beforeEach(waitForAsync(() => {
    apiWalletServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getCoin: TEST_COINS[0]
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    TestBed.configureTestingModule({
      declarations: [ OperationsListItemComponent, FakeTrackClickDirective, FormattedAmountPipe ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsListItemComponent);
    component = fixture.componentInstance;
    component.operation = cashIn;
    component.isLast = false;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show item lines if is the last item', async () => {
    component.isLast = true;
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const el = fixture.debugElement.query(By.css('ion-item[name="Operation Item"]')).nativeElement;
    expect(el.attributes['ng-reflect-lines'].value).toEqual('none');
  });
  
  it('should call trackEvent on trackService when Operation Item clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-item', 'Operation Item');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to detail when Operation Item clicked', () => {
    fixture.debugElement.query(By.css('ion-item[name="Operation Item"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/fiat-ramps/kripton-operation-detail/53']);
  });

  it('should get status on ngOnInit', () => {
    expect(component.status).toEqual(OPERATION_STATUS[0]);
  });

  it('should show highlight incomplete operations', () => {
    component.operation = incompleteOperation;
    component.ngOnInit();
    fixture.detectChanges();
    const colorCssClassEl = fixture.debugElement.query(By.css('.highlight'));

    expect(colorCssClassEl).toBeTruthy();
  });

  it('should not show highlight operations by default', () => {
    component.operation = inProgressOperation;
    component.ngOnInit();
    fixture.detectChanges();
    const colorCssClassEl = fixture.debugElement.query(By.css('.highlight'));

    expect(colorCssClassEl).toBeFalsy();
  });

  it('should show amount_out and currency_out on cash-in', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const coinEl = fixture.debugElement.query(By.css('ion-label[name="Provider"]')).nativeElement;
    const amountEl = fixture.debugElement.query(By.css('ion-label[name="Amount"]')).nativeElement;
    expect(coinEl.innerText).toContain(cashIn.currency_out);
    expect(amountEl.innerText).toContain(cashIn.amount_out);
  });
});
