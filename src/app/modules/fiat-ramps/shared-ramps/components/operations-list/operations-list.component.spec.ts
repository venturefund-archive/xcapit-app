import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';

import { OperationsListComponent } from './operations-list.component';

const operations: FiatRampOperation[] = [
  {
    operation_id: 1,
    amount_in: 12,
    currency_in: 'ETH',
    amount_out: 21,
    currency_out: 'ARS',
    status: 'complete',
    created_at: new Date(),
    provider: '1',
    operation_type: 'cash-in'
  },
  {
    operation_id: 2,
    amount_in: 23,
    currency_in: 'USDT',
    amount_out: 21,
    currency_out: 'ARS',
    status: 'complete',
    created_at: new Date(),
    provider: '1',
    operation_type: 'cash-in'
  },
  {
    operation_id: 3,
    amount_in: 32,
    currency_in: 'ETH',
    amount_out: 21,
    currency_out: 'ARS',
    status: 'complete',
    created_at: new Date(),
    provider: '1',
    operation_type: 'cash-in'
  },
];
describe('OperationsListComponent', () => {
  let component: OperationsListComponent;
  let fixture: ComponentFixture<OperationsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsListComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsListComponent);
    component = fixture.componentInstance;
    component.operationsList = operations;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render operations list component if there is three operations', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const tableEl = fixture.debugElement.query(By.css('app-operations-list-accordion'));
    const textEl = fixture.debugElement.query(By.css('ion-text[name="No Operations"]'));
    expect(tableEl).toBeTruthy();
    expect(textEl).toBeFalsy();
    expect(component.firstOperations.length).toEqual(2);
    expect(component.remainingOperations.length).toEqual(1);
  });

  it('should render operations list component if there is one operation', () => {
    component.operationsList = [operations[1]];
    component.ngOnInit();
    fixture.detectChanges();
    const tableEl = fixture.debugElement.query(By.css('app-operations-list-accordion'));
    expect(tableEl).toBeTruthy();
    expect(component.firstOperations.length).toEqual(1);
    expect(component.remainingOperations.length).toEqual(0);
  });

  it('should render message if no operations', async () => {
    component.operationsList = [];
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const tableEl = fixture.debugElement.query(By.css('app-operations-list-accordion'));
    const textEl = fixture.debugElement.query(By.css('ion-text[name="No Operations"]'));
    expect(textEl).toBeTruthy();
    expect(tableEl).toBeFalsy();
  });
});
