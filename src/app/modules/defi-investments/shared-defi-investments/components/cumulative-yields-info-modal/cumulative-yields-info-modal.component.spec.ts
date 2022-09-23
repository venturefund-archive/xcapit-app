import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CumulativeYieldsInfoModalComponent } from './cumulative-yields-info-modal.component';

describe('CumulativeYieldsInfoModalComponent', () => {
  let component: CumulativeYieldsInfoModalComponent;
  let fixture: ComponentFixture<CumulativeYieldsInfoModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CumulativeYieldsInfoModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CumulativeYieldsInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
