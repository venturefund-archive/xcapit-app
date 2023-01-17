import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ProviderNewOperationCardComponent } from './provider-new-operation-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { rawProvidersData } from '../../../fixtures/raw-providers-data';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

describe('ProviderNewOperationCardComponent', () => {
  let component: ProviderNewOperationCardComponent;
  let fixture: ComponentFixture<ProviderNewOperationCardComponent>;
  let formGroupDirectiveMock: FormGroupDirective;
  let controlContainerMock: UntypedFormGroup;
  let coinSpy: jasmine.SpyObj<Coin>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(waitForAsync(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' });

    controlContainerMock = new UntypedFormBuilder().group({
      cryptoAmount: [1, [Validators.required]],
      fiatAmount: [11, [Validators.required]],
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;

    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    TestBed.configureTestingModule({
      declarations: [ProviderNewOperationCardComponent, FormattedAmountPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
        { provide: ModalController, useValue: modalControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderNewOperationCardComponent);
    component = fixture.componentInstance;

    component.provider = rawProvidersData[1];
    component.coin = coinSpy;
    component.minimumFiatAmount = 10;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit changeCurrency event when currency selector is clicked', () => {
    const spy = spyOn(component.changeCurrency, 'emit');
    fixture.debugElement.query(By.css('app-coin-selector')).triggerEventHandler('changeCurrency', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show error message and add invalid class to ion-inputs if form is not valid', () => {
    component.form.get('fiatAmount').addValidators(CustomValidators.greaterThan(5));
    component.form.patchValue({ fiatAmount: 4 });
    component.form.markAllAsTouched();
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('.pnoc__amount-select__inputs-errors__error'));
    const amountEl = fixture.debugElement.query(By.css('.pnoc__amount-select__inputs__amount > ion-input'));
    const quoteAmountEl = fixture.debugElement.query(By.css('.pnoc__amount-select__inputs__quoteAmount > ion-input'));

    expect(component.form.valid).toBeFalse();
    expect(labelEl).toBeTruthy();
    expect(amountEl).toBeTruthy();
    expect(amountEl.classes.invalid).toBeTrue();
    expect(quoteAmountEl).toBeTruthy();
    expect(quoteAmountEl.classes.invalid).toBeTrue();
  });

  it('should show skeleton when fee is undefined', () => {
    component.provider = rawProvidersData.find((provider) => provider.alias === 'PX');
    component.fee = { value: undefined, token: undefined };
    fixture.detectChanges();
    const skeleton = fixture.debugElement.query(By.css('div.skeleton > ion-skeleton-text'));

    expect(skeleton).toBeTruthy();
  });

  it('should show fee when fee is defined', () => {
    component.provider = rawProvidersData.find((provider) => provider.alias === 'PX');
    component.fee = { value: 10.4278, token: 'USD' };
    fixture.detectChanges();
    const feeLabelEl = fixture.debugElement.query(By.css('div.pnoc__fee__label > ion-text'));
    const feeInfoIconEl = fixture.debugElement.query(
      By.css('div.pnoc__fee__label > ion-icon[name="information-circle"]')
    );
    const feeAmountEl = fixture.debugElement.query(By.css('div.pnoc__fee__amount > ion-text'));

    expect(feeLabelEl.nativeElement.innerHTML).toContain('fiat_ramps.shared.provider_new_operation_card.estimated_fee');
    expect(feeInfoIconEl).toBeTruthy();
    expect(feeAmountEl.nativeElement.innerHTML).toContain('10.43 USD');
  });

  it('should show modal when fee info icon is clicked', async () => {
    component.provider = rawProvidersData.find((provider) => provider.alias === 'PX');
    component.fee = { value: 10.4278, token: 'USD' };
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('div.pnoc__fee__label > ion-icon[name="information-circle"]'))
      .nativeElement.click();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show directa24 modal when info provider icon is clicked', async () => {
    component.isInfoModalOpen = false;
    component.provider = rawProvidersData.find((provider) => provider.alias === 'PX');
    component.fee = { value: 10.4278, token: 'USD' };
    component.ngOnInit();
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('div.pnoc__provider__content__info ion-icon'))
      .nativeElement.click();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show kripton modal when info provider icon is clicked', async () => {
    component.isInfoModalOpen = false;
    component.provider = rawProvidersData.find((provider) => provider.alias === 'kripton');
    component.fee = { value: 10.4278, token: 'USD' };
    component.ngOnInit();
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('div.pnoc__provider__content__info ion-icon'))
      .nativeElement.click();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show moonpay modal when info provider icon is clicked', async () => {
    component.isInfoModalOpen = false;
    component.provider = rawProvidersData.find((provider) => provider.alias === 'moonpay');
    component.fee = { value: 10.4278, token: 'USD' };
    component.ngOnInit();
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('div.pnoc__provider__content__info ion-icon'))
      .nativeElement.click();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should set minimum fiat amount on ngOnChanges', () => {
    const change: SimpleChanges = { minimumFiatAmount: new SimpleChange('0', '2913', false)}
    component.ngOnChanges(change);

    expect(component.minimumFiatAmount).toEqual(2913);
  });
});
