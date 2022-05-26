import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AmountInputCardSkeletonComponent } from './amount-input-card-skeleton.component';

describe('AmountInputCardSkeletonComponent', () => {
  let component: AmountInputCardSkeletonComponent;
  let fixture: ComponentFixture<AmountInputCardSkeletonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountInputCardSkeletonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AmountInputCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
