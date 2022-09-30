import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CumulativeTotalYieldsComponent } from './cumulative-total-yields.component';

describe('CumulativeTotalYieldsComponent', () => {
  let component: CumulativeTotalYieldsComponent;
  let fixture: ComponentFixture<CumulativeTotalYieldsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CumulativeTotalYieldsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CumulativeTotalYieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
