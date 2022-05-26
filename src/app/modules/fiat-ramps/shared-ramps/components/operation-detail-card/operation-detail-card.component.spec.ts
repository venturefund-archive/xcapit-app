import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { OperationStatus } from '../../interfaces/operation-status.interface';
import { OperationDetailCardComponent } from './operation-detail-card.component';

const testOperation: FiatRampOperation = {
  operation_id: 364,
  operation_type: 'cash-in',
  status: 'pending_by_validate',
  currency_in: 'ars',
  amount_in: 145.68149073,
  currency_out: 'MATIC',
  amount_out: 1.38660038,
  created_at: new Date('2022-05-13T17:30:23.258Z'),
  provider: '1',
  voucher: false,
};

const testStatus: OperationStatus = {
  providerId: 1,
  name: 'pending_by_validate',
  textToShow: 'in_progress',
  colorCssClass: 'warning'
};

const testAddress = '0x0000000000000000000000000000000000000000';
const testNetwork = 'Polygon';

fdescribe('OperationDetailCardComponent', () => {
  let component: OperationDetailCardComponent;
  let fixture: ComponentFixture<OperationDetailCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationDetailCardComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationDetailCardComponent);
    component = fixture.componentInstance;
    component.operation = testOperation;
    component.operationStatus = testStatus;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get operation and operation status on ionViewWillEnter', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    
  });

  it('should get wallet address and network on ionViewWillEnter', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.address).toEqual(testAddress);
    expect(component.network).toEqual(testNetwork);
  });
});
