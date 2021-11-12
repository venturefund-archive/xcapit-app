import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComingSoonInvestmentsComponent } from './coming-soon-investments.component';

describe('ComingSoonInvestmentsComponent', () => {
  let component: ComingSoonInvestmentsComponent;
  let fixture: ComponentFixture<ComingSoonInvestmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComingSoonInvestmentsComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ComingSoonInvestmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
