import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { OPERATION_STATUS } from '../../constants/operation-status';
import { OperationStatusChipComponent } from './operation-status-chip.component';

describe('OperationStatusChipComponent', () => {
  let component: OperationStatusChipComponent;
  let fixture: ComponentFixture<OperationStatusChipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationStatusChipComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationStatusChipComponent);
    component = fixture.componentInstance;
    component.status = OPERATION_STATUS[0];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
