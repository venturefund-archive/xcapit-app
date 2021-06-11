import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaxfulRecordatoryCardComponent } from './paxful-recordatory-card.component';

describe('PaxfulRecordatoryCardComponent', () => {
  let component: PaxfulRecordatoryCardComponent;
  let fixture: ComponentFixture<PaxfulRecordatoryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaxfulRecordatoryCardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaxfulRecordatoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
