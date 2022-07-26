import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { FiatInputComponent } from './fiat-input.component';

describe('FiatInputComponent', () => {
  let component: FiatInputComponent;
  let fixture: ComponentFixture<FiatInputComponent>;
  let controlContainerMock: UntypedFormGroup;
  let formGroupDirectiveMock: FormGroupDirective;

  beforeEach(waitForAsync(() => {
    controlContainerMock = new UntypedFormGroup({
      fiatAmount: new UntypedFormControl(),
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;
    TestBed.configureTestingModule({
      declarations: [ FiatInputComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(),ReactiveFormsModule],
      providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(FiatInputComponent);
    component = fixture.componentInstance;
    component.label = 'textLabel'
    component.disclaimer = 'textDisclaimer'
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const labelEl = fixture.debugElement.query(By.css('ion-label.fi__amount-select__qty-label__base'));
    const currencyEl = fixture.debugElement.query(By.css('ion-label.fi__amount-select__labels__base'));
    const disclaimerEl = fixture.debugElement.query(By.css('ion-text.fi__amount-select__usd-disclaimer'));
    expect(labelEl.nativeElement.innerHTML).toContain(component.label);
    expect(currencyEl.nativeElement.innerHTML).toContain('USD');
    expect(disclaimerEl.nativeElement.innerHTML).toContain(component.disclaimer);
  })
});