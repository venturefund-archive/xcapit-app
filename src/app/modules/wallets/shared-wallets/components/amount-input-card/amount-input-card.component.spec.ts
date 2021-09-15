import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AmountInputCardComponent } from './amount-input-card.component';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { of } from 'rxjs';

describe('AmountInputCardComponent', () => {
  let component: AmountInputCardComponent;
  let fixture: ComponentFixture<AmountInputCardComponent>;
  let controlContainerMock: FormGroup;
  let formGroupDirectiveMock: FormGroupDirective;
  let apiWalletServiceSpy: any;
  let onInitSpy;
  beforeEach(() => {
    controlContainerMock = new FormBuilder().group({
      amount: ['', []],
      referenceAmount: ['', []],
    });
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getPrices: of({ prices: { LINK: 25.5, BTC: 50000 } }),
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;
    TestBed.configureTestingModule({
      declarations: [AmountInputCardComponent],
      imports: [IonicModule, ReactiveFormsModule],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AmountInputCardComponent);
    component = fixture.componentInstance;
    component.currencyName = 'LINK';
    component.referenceCurrencyName = 'USDT';
    component.title = 'test';
    onInitSpy = spyOn(component, 'ngOnInit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set reference equivalent value when amount change', async () => {
    const spy = spyOn(component.form, 'patchValue').and.callThrough();
    component.ngOnInit();
    component.form.patchValue({ amount: 20 });
    await fixture.whenStable();

    expect(apiWalletServiceSpy.getPrices).toHaveBeenCalledOnceWith(['LINK'], false);
    expect(spy).toHaveBeenCalledWith({ amount: 20 });
    expect(spy).toHaveBeenCalledWith({ referenceAmount: 510 });
  });

  it('should call with BTC as base when currency is RBTC', async () => {
    component.currencyName = 'RBTC';
    const spy = spyOn(component.form, 'patchValue').and.callThrough();
    component.ngOnInit();
    component.form.patchValue({ amount: 20 });
    await fixture.whenStable();

    expect(apiWalletServiceSpy.getPrices).toHaveBeenCalledOnceWith(['BTC'], false);
    expect(spy).toHaveBeenCalledWith({ amount: 20 });
    expect(spy).toHaveBeenCalledWith({ referenceAmount: 1000000 });
  });
});
