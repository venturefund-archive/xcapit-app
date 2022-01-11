import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AmountInputCardComponent } from './amount-input-card.component';

describe('AmountInputCardComponent', () => {
  let component: AmountInputCardComponent;
  let fixture: ComponentFixture<AmountInputCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountInputCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AmountInputCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
