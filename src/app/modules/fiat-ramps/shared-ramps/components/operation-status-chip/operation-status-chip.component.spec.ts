import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
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
    component.statusName = 'wait';
    component.operationType = 'cash-in';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show text according to wait status', () => {
    const textEl = fixture.debugElement.query(By.css('.chip > ion-text')).nativeElement.textContent;
    const colorCssClassEl = fixture.debugElement.query(By.css('.warning'));

    expect(textEl).toContain('fiat_ramps.operation_status.incomplete');
    expect(colorCssClassEl).toBeTruthy();
  });

  it('should show text according to wait status', () => {
    component.statusName = 'cancel'
    component.ngOnInit();
    fixture.detectChanges();
    const textEl = fixture.debugElement.query(By.css('.chip > ion-text')).nativeElement.textContent;
    const colorCssClassEl = fixture.debugElement.query(By.css('.danger'));

    expect(textEl).toContain('fiat_ramps.operation_status.cancel');
    expect(colorCssClassEl).toBeTruthy();
  });
});
