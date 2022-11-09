import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OperationKmInProgressModalComponent } from './operation-km-in-progress-modal.component';

describe('OperationKmInProgressModalComponent', () => {
  let component: OperationKmInProgressModalComponent;
  let fixture: ComponentFixture<OperationKmInProgressModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationKmInProgressModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationKmInProgressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
