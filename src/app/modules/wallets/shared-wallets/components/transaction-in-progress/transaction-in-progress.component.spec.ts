import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransactionInProgressComponent } from './transaction-in-progress.component';

describe('TransactionInProgressComponent', () => {
  let component: TransactionInProgressComponent;
  let fixture: ComponentFixture<TransactionInProgressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionInProgressComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get txs in progress');

  it('should render operations in progress if there is a swap and a send pending', async () => {
    txInProgressServiceSpy.inProgress.and.returnValue(of([txSwap, txSend]));
    component.ionViewWillEnter()
    fixture.detectChanges();
    const txCardEl = fixture.debugElement.queryAll(By.css('app-transaction-in-progress-card'));
    expect(txCardEl.length).toEqual(2)

  });

  it('should not render operations in progress if there are no tx in progress', async () => {
    txInProgressServiceSpy.inProgress.and.returnValue(of([]));
    component.ionViewWillEnter()
    fixture.detectChanges();
    const txCardEl = fixture.debugElement.queryAll(By.css('app-transaction-in-progress-card'));
    expect(txCardEl.length).toEqual(0)
  });

  it('should unsubscribe on ionViewWillLeave', async () => {
    const spy = spyOn(component, 'unsubscribe').and.callThrough();
    await component.ionViewWillEnter();
    await component.ionViewWillLeave();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
