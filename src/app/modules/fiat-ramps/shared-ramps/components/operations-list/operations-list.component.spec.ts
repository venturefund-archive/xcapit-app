import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TEST_ERC20_COINS } from 'src/app/modules/wallets/shared-wallets/constants/coins.test';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';
import { OperationStatus } from '../../interfaces/operation-status.interface';
import { FiatRampOperation } from '../../models/fiat-ramp-operation';
import { OperationStatusChipComponent } from '../operation-status-chip/operation-status-chip.component';
import { OperationsListAccordionComponent } from '../operations-list-accordion/operations-list-accordion.component';
import { OperationsListItemComponent } from '../operations-list-item/operations-list-item.component';

import { OperationsListComponent } from './operations-list.component';
const provider: FiatRampProvider = {
  id: 1,
  alias: 'kripton',
  name: 'KriptonMarket',
  logoRoute: '../../assets/img/provider-logos/KriptonMarket.svg',
  newOperationRoute: '/fiat-ramps/new-operation',
};

const operationStatus: OperationStatus = {
  provider: provider,
  name: 'complete',
  textToShow: 'deposited',
  colorCssClass: 'success',
};

const operations: FiatRampOperation[] = [
  {
    _anId: 1,
    _anAmount: 12,
    _aCoin: TEST_ERC20_COINS[0],
    _anOperationStatus: operationStatus,
    _aProvider: provider,
    _aCreationDate: new Date(),
  },
  {
    _anId: 2,
    _anAmount: 23,
    _aCoin: TEST_ERC20_COINS[1],
    _anOperationStatus: operationStatus,
    _aProvider: provider,
    _aCreationDate: new Date(),
  },
  {
    _anId: 3,
    _anAmount: 32,
    _aCoin: TEST_ERC20_COINS[0],
    _anOperationStatus: operationStatus,
    _aProvider: provider,
    _aCreationDate: new Date(),
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
    const tableEl = fixture.debugElement.query(By.css('app-operations-list-accordion'));
    const textEl = fixture.debugElement.query(By.css('ion-text[name="No Operations"]'));
    expect(tableEl).toBeTruthy();
    expect(textEl).toBeFalsy();
    expect(component.firstOperations.length).toEqual(2);
    expect(component.remainingOperations.length).toEqual(1);
  });

  it('should render operations list component if there is one operation', () => {
    component.operationsList = [operations[1]];
    fixture.detectChanges();
    const tableEl = fixture.debugElement.query(By.css('app-operations-list-accordion'));
    expect(tableEl).toBeTruthy();
    expect(component.firstOperations.length).toEqual(1);
    expect(component.remainingOperations.length).toEqual(0);
  });

  it('should render message if no operations', async () => {
    component.operationsList = [];
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const tableEl = fixture.debugElement.query(By.css('app-operations-list-accordion'));
    const textEl = fixture.debugElement.query(By.css('ion-text[name="No Operations"]'));
    expect(textEl).toBeTruthy();
    expect(tableEl).toBeFalsy();
  });
});
