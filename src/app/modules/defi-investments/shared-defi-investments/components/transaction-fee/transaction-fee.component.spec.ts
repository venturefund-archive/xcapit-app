import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { TransactionFeeComponent } from './transaction-fee.component';

describe('TransactionFeeComponent', () => {
  let component: TransactionFeeComponent;
  let fixture: ComponentFixture<TransactionFeeComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<TransactionFeeComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TransactionFeeComponent, FormattedAmountPipe, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: ModalController, useValue: modalControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(TransactionFeeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render skeleton when quoteFee value is not available', () => {
    component.quoteFee.value = undefined;
    expect(fixture.debugElement.query(By.css('.skeleton ion-skeleton-text'))).toBeTruthy();
  });

  it('should render advice div when you dont have necessary fee', () => {
    component.fee.value = 2;
    component.balance = 1;
    component.quoteFee.value = 0.0017;
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div.tf__fee__qty_and_advice__funds-advice'));
    expect(divEl).toBeTruthy();
  });

  it('should not render advice div when you dont have necessary fee', () => {
    component.fee.value = 0.0017;
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div.tf__fee__qty_and_advice__funds-advice'));
    expect(divEl).toBeFalsy();
  });

  it('should not render skeleton when quoteFee value is available', async () => {
    component.quoteFee.value = 0.017;
    fixture.detectChanges();
    await fixture.whenStable();
    const skeletonEl = fixture.debugElement.query(By.css('.skeleton ion-skeleton-text'));
    expect(skeletonEl).toBeFalsy();
  });

  it('should show modal on trackService when transactionFee clicked', () => {
    component.transactionFee = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'transaction_fee');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit event and when transaction fee clicked', () => {
    component.transactionFee = true;
    fixture.detectChanges();
    const spy = spyOn(component.transactionFeeInfoClicked, 'emit');
    const infoButtonel = fixture.debugElement.query(By.css('ion-button[name="transaction_fee"]'));
    infoButtonel.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
