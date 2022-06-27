import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AmountInputCardComponent } from './amount-input-card.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SpyProperty } from '../../../../testing/spy-property.spec';
import { FormattedAmountPipe } from '../../pipes/formatted-amount/formatted-amount.pipe';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { SummaryData } from 'src/app/modules/wallets/send/send-summary/interfaces/summary-data.interface';

const testCoins = [
  {
    id: 0,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    native: true,
  },
  {
    id: 1,
    name: 'LINK - Chainlink',
    logoRoute: 'assets/img/coins/LINK.png',
    last: false,
    value: 'LINK',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    contract: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
    decimals: 18,
  },
];

describe('AmountInputCardComponent', () => {
  let component: AmountInputCardComponent;
  let fixture: ComponentFixture<AmountInputCardComponent>;
  let formGroupDirectiveSpy: jasmine.SpyObj<FormGroupDirective>;
  let formGroupMock: FormGroup;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<AmountInputCardComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach( () => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    waitForAsync(() => {
      formGroupMock = new FormGroup({
        amount: new FormControl(),
        quoteAmount: new FormControl(),
      });
      formGroupDirectiveSpy = jasmine.createSpyObj(
        'FormGroupDirective',
        {},
        {
          form: formGroupMock,
        }
      );
      TestBed.configureTestingModule({
        declarations: [AmountInputCardComponent, FormattedAmountPipe],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveSpy },
          { provide: ModalController, useValue: modalControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(AmountInputCardComponent);
      component = fixture.componentInstance;
      component.baseCurrency = testCoins[0];
      component.feeToken = testCoins[0];
      component.max = 2;
      component.quotePrice = 10;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set quote balance on init', () => {
    component.ngOnInit();
    expect(component.quoteMax).toEqual(20);
  });

  it('should recalculate quote balance when input changes', () => {
    component.quotePrice = 20;
    component.ngOnChanges();
    expect(component.quoteMax).toEqual(40);
  });

  it('should not show scientific notation on USD amount', () => {
    component.form.patchValue({ amount: 1e-20 });
    expect(component.form.value.quoteAmount).not.toContain('e');
  });

  it('should set max on max button clicked', () => {
    component.max = 20;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button.aic__content__inputs__amount_with_max__max')).nativeElement.click();
    fixture.detectChanges();
    expect(component.form.value.amount).toEqual(20);
  });

  it('should not render range and percentage when showRange false', async () => {
    component.showRange = false;
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const percentageEl = fixture.debugElement.query(By.css('div.aic__content__percentage'));
    const rangeEl = fixture.debugElement.query(By.css('.aic__content ion-range'));
    expect(percentageEl).toBe(null);
    expect(rangeEl).toBe(null);
  });

  it('should render properly available div', async () => {
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const availableEl = fixture.debugElement.query(By.css('.aic__available'));
    expect(availableEl.nativeElement.innerHTML).toBeTruthy();
  });

  it('should show modal on trackService when ux_phrase_information clicked', async () => {
    component.amountSend = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_phrase_information');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not allow multiple phrase info modals opening', async () => {
    component.amountSend = true;
    fixture.detectChanges();
    const infoButtonel = fixture.debugElement.query(By.css('ion-button[name="ux_phrase_information"]'))
    infoButtonel.nativeElement.click();
    infoButtonel.nativeElement.click();
    infoButtonel.nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  describe('ShowRange enabled', () => {
    beforeEach(
      waitForAsync(() => {
        formGroupMock = new FormGroup({
          amount: new FormControl(),
          quoteAmount: new FormControl(),
          percentage: new FormControl(),
          range: new FormControl(),
        });
        new SpyProperty(formGroupDirectiveSpy, 'form').value().and.returnValue(formGroupMock);
        component.showRange = true;
        component.max = 200;
        component.quotePrice = 10;
        component.ngOnInit();
      })
    );

    it('should render percentage and range when showRange is enabled', async () => {
      Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
      fixture.detectChanges();
      const percentageEl = fixture.debugElement.query(By.css('div.aic__content__percentage'));
      const rangeEl = fixture.debugElement.query(By.css('.aic__content ion-range'));
      expect(percentageEl).toBeTruthy();
      expect(rangeEl).toBeTruthy();
    });

    it('should calculate all inputs when amount changes', async () => {
      component.form.patchValue({ amount: 10 });
      expect(component.form.value).toEqual({ percentage: 5, range: 5, amount: 10, quoteAmount: '100' });
    });

    it('should calculate all inputs when quoteAmount changes', async () => {
      component.form.patchValue({ quoteAmount: 100 });
      expect(component.form.value).toEqual({ percentage: 5, range: 5, amount: 10, quoteAmount: 100 });
    });

    it('should calculate all inputs when range changes', async () => {
      component.form.patchValue({ range: 10 });
      expect(component.form.value).toEqual({ percentage: 10, range: 10, amount: 20, quoteAmount: '200' });
    });

    it('should calculate all inputs when percentage changes', async () => {
      component.form.patchValue({ percentage: 10 });
      expect(component.form.value).toEqual({ percentage: 10, range: 10, amount: 20, quoteAmount: '200' });
    });

    it('should patch entries to the maximum balance when the user enters a value greater than 100% of the available balance', () => {
      component.form.patchValue({ amount: 201, quoteAmount: 2001, percentage: 101 });
      expect(component.form.value).toEqual({
        quoteAmount: '2000',
        percentage: 100,
        range: 100,
        amount: 200,
      });
    });

    it('should patch entries to zero balance when the user deletes any value', () => {
      component.form.patchValue({ amount: 0, quoteAmount: 0, percentage: null });
      expect(component.form.value).toEqual({
        quoteAmount: '0',
        percentage: 0,
        range: 0,
        amount: 0,
      });

    });
  });
});
