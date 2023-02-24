import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subscription } from 'rxjs';
import { TxInProgressService } from 'src/app/modules/swaps/shared-swaps/services/tx-in-progress/tx-in-progress.service';
import { SendTxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/send/send-tx-in-progress';
import { SwapTxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/swap/swap-tx-in-progress';
import { TxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/tx-in-progress.interface';
import { DefaultTxHash } from '../../models/tx-hash/default/default-tx-hash';
import { TransactionInProgressComponent } from './transaction-in-progress.component';
import { Blockchain } from '../../../../swaps/shared-swaps/models/blockchain/blockchain';
import { rawPolygonData } from '../../../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';

describe('TransactionInProgressComponent', () => {
  let component: TransactionInProgressComponent;
  let fixture: ComponentFixture<TransactionInProgressComponent>;
  let txInProgressServiceSpy: jasmine.SpyObj<TxInProgressService>;
  let txSend: TxInProgress;
  let txSwap: TxInProgress;

  const aDate = new Date('2023-01-01');
  const aTestHash = new DefaultTxHash('aTestHash');
  const aTestNetwork = 'aTestNetwork';
  const blockchain = new Blockchain(rawPolygonData);

  beforeEach(waitForAsync(() => {
    txSwap = new SwapTxInProgress(blockchain, aDate);
    txSend = new SendTxInProgress(blockchain, aTestHash, aDate);

    txInProgressServiceSpy = jasmine.createSpyObj('TxInProgressService', {
      inProgress: of([txSwap, txSend]),
    });
    TestBed.configureTestingModule({
      declarations: [TransactionInProgressComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: TxInProgressService, useValue: txInProgressServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide component when no operations', () => {
    txInProgressServiceSpy.inProgress.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.tip'));
    expect(el).toBeFalsy();
  });

  it('should render operations in progress if there is a swap and a send pending', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const txCardEl = fixture.debugElement.queryAll(By.css('app-transaction-in-progress-card'));
    expect(txCardEl.length).toEqual(2);
  });

  it('should not render operations in progress if there are no tx in progress', () => {
    txInProgressServiceSpy.inProgress.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();
    const txCardEl = fixture.debugElement.queryAll(By.css('app-transaction-in-progress-card'));
    expect(txCardEl.length).toEqual(0);
  });

  it('should show toggle when more than one operation', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const accordionEl = fixture.debugElement.query(By.css('ion-accordion-group'));
    expect(accordionEl).toBeTruthy();
  });

  it('should not show toggle when one operation', () => {
    txInProgressServiceSpy.inProgress.and.returnValue(of([txSend]));
    component.ngOnInit();
    fixture.detectChanges();
    const accordionEl = fixture.debugElement.query(By.css('ion-accordion-group'));
    expect(accordionEl).toBeFalsy();
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const spy = spyOn(Subscription.prototype, 'unsubscribe').and.callThrough();
    component.ngOnInit();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
