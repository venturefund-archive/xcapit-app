import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { rawProvidersData } from '../../fixtures/raw-providers-data';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { ProvidersFactory } from '../../models/providers/factory/providers.factory';
import { Providers } from '../../models/providers/providers.interface';
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
    operation_type: 'cash-in',
    voucher: false,
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
    operation_type: 'cash-in',
    voucher: false,
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
    operation_type: 'cash-in',
    voucher: false,
  },
  {
    operation_id: 4,
    amount_in: 34,
    currency_in: 'ETH',
    amount_out: 22,
    currency_out: 'ARS',
    status: 'complete',
    created_at: new Date(),
    provider: '1',
    operation_type: 'cash-in',
    voucher: false,
  },
];
describe('OperationsListComponent', () => {
  let component: OperationsListComponent;
  let fixture: ComponentFixture<OperationsListComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  
  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    providersSpy = jasmine.createSpyObj('Providers', {
      byAlias: rawProvidersData[1],
    });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: providersSpy,
    });
    TestBed.configureTestingModule({
      declarations: [OperationsListComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
      ],
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

  it('should render operations list component if there is four operations', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const tableEl = fixture.debugElement.query(By.css('app-operations-list-accordion'));
    const textEl = fixture.debugElement.query(By.css('ion-text[name="No Operations"]'));
    expect(tableEl).toBeTruthy();
    expect(textEl).toBeFalsy();
    expect(component.firstOperations.length).toEqual(3);
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

  it('should update operation List when input changes', () => {
    component.operationsList = [];
    component.ngOnInit();
    fixture.detectChanges();
    const change: SimpleChanges = { operationsList: new SimpleChange([], [{}, {}], true) };
    component.ngOnChanges(change);
    expect(component.operationsList.length).toEqual(2);
  });

  it('should navigate to user-email when link is clicked', () => {
    component.operationsList = [];
    component.ngOnInit();
    fixture.detectChanges();
    const textEl = fixture.debugElement.query(By.css('ion-text.link')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/user-email');
  });

  it('should show informative modal of Kripton Market provider when information-circle clicked', async () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-icon[name="information-circle"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
