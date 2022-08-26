import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProviderNewOperationCardComponent } from './provider-new-operation-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { rawProvidersData } from '../../../fixtures/raw-providers-data';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';

describe('ProviderNewOperationCardComponent', () => {
  let component: ProviderNewOperationCardComponent;
  let fixture: ComponentFixture<ProviderNewOperationCardComponent>;
  let formGroupDirectiveMock: FormGroupDirective;
  let controlContainerMock: UntypedFormGroup;
  let coinSpy: jasmine.SpyObj<Coin>;

  beforeEach(waitForAsync(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' });

    controlContainerMock = new UntypedFormBuilder().group({
      cryptoAmount: [1, [Validators.required]],
      fiatAmount: [11, [Validators.required]],
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;

    TestBed.configureTestingModule({
      declarations: [ProviderNewOperationCardComponent, FormattedAmountPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderNewOperationCardComponent);
    component = fixture.componentInstance;

    component.provider = rawProvidersData[0];
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
    component.form.get('cryptoAmount').addValidators(CustomValidators.greaterThan(5))
    component.form.patchValue({cryptoAmount: 4});
    component.form.markAllAsTouched()
    fixture.detectChanges();
    
    const labelEl = fixture.debugElement.query(By.css('.pnoc__amount-select__inputs-errors__error'))
    const amountEl = fixture.debugElement.query(By.css('.pnoc__amount-select__inputs__amount > ion-input'))
    const quoteAmountEl = fixture.debugElement.query(By.css('.pnoc__amount-select__inputs__quoteAmount > ion-input'))

    expect(component.form.valid).toBeFalse();
    expect(labelEl).toBeTruthy();     
    expect(amountEl).toBeTruthy();     
    expect(amountEl.classes.invalid).toBeTrue();     
    expect(quoteAmountEl).toBeTruthy();     
    expect(quoteAmountEl.classes.invalid).toBeTrue();     
  });
});
