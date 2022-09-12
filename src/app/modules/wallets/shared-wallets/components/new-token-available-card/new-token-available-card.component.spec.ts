import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewTokenAvailableCardComponent } from './new-token-available-card.component';

describe('NewTokenAvailableCardComponent', () => {
  let component: NewTokenAvailableCardComponent;
  let fixture: ComponentFixture<NewTokenAvailableCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTokenAvailableCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewTokenAvailableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
