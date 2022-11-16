import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InProgressTransactionModalComponent } from './in-progress-transaction-modal.component';

describe('InProgressTransactionModalComponent', () => {
  let component: InProgressTransactionModalComponent;
  let fixture: ComponentFixture<InProgressTransactionModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InProgressTransactionModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InProgressTransactionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
