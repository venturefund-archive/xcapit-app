import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChooseInvestorProfileCardComponent } from './choose-investor-profile-card.component';

describe('ChooseInvestorProfileCardComponent', () => {
  let component: ChooseInvestorProfileCardComponent;
  let fixture: ComponentFixture<ChooseInvestorProfileCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseInvestorProfileCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseInvestorProfileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
