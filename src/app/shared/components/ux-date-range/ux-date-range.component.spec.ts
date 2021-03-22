import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UxDateRangeComponent } from './ux-date-range.component';

describe('UxDateRangeComponent', () => {
  let component: UxDateRangeComponent;
  let fixture: ComponentFixture<UxDateRangeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UxDateRangeComponent ],
      imports: [IonicModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UxDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
