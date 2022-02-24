import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DefiInvestmentWithdrawComponent } from './defi-investment-withdraw.component';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { SplitStringPipe } from '../../../../../shared/pipes/split-string/split-string.pipe';
import { Coin } from '../../../../wallets/shared-wallets/interfaces/coin.interface';
import { Amount } from '../../types/amount.type';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DefiInvestmentWithdrawComponent', () => {
  let component: DefiInvestmentWithdrawComponent;
  let fixture: ComponentFixture<DefiInvestmentWithdrawComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DefiInvestmentWithdrawComponent>;
  let coinSpy: jasmine.SpyObj<Coin>;
  let amountSpy: jasmine.SpyObj<Amount>;

  beforeEach(
    waitForAsync(() => {
      amountSpy = jasmine.createSpyObj('Amount', {}, { value: 1, token: 'MATIC' });
      coinSpy = jasmine.createSpyObj('Coin', {}, { name: 'USDC', logoRoute: '' });
      TestBed.configureTestingModule({
        declarations: [DefiInvestmentWithdrawComponent, FakeTrackClickDirective, SplitStringPipe],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(DefiInvestmentWithdrawComponent);
      component = fixture.componentInstance;
      component.token = coinSpy;
      component.amount = amountSpy;
      component.quoteAmount = amountSpy;
      component.fee = amountSpy;
      component.quoteFee = amountSpy;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit withdraw event', () => {
    const spy = spyOn(component.withdrawClicked, 'emit');
    const button = fixture.debugElement.query(By.css('ion-button[name="Confirm Withdrawal"]'));
    button.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Confirm Withdrawal button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Confirm Withdrawal');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
