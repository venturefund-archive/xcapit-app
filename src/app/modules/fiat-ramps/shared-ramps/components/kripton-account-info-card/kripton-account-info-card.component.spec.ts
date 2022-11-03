import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KriptonAccountInfoCardComponent } from './kripton-account-info-card.component';

describe('KriptonAccountInfoCardComponent', () => {
  let component: KriptonAccountInfoCardComponent;
  let fixture: ComponentFixture<KriptonAccountInfoCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KriptonAccountInfoCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KriptonAccountInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
