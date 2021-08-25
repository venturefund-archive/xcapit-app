import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AmountInputCardComponent } from './amount-input-card.component';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AmountInputCardComponent', () => {
  let component: AmountInputCardComponent;
  let fixture: ComponentFixture<AmountInputCardComponent>;
  let controlContainerMock: FormGroup;
  let formGroupDirectiveMock: FormGroupDirective;

  beforeEach(() => {
    controlContainerMock = new FormGroup({
      amount: new FormControl(),
      referenceAmount: new FormControl(),
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;
    TestBed.configureTestingModule({
      declarations: [AmountInputCardComponent],
      imports: [IonicModule, ReactiveFormsModule],
      providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AmountInputCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set reference equivalent value when amount change', async () => {
    component.ngOnInit();
    const spy = spyOn(component.form, 'patchValue').and.callThrough();
    component.form.patchValue({ amount: 20 });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith({ referenceAmount: 20 });
    expect(spy).toHaveBeenCalledWith({ amount: 20 });
  });
});
