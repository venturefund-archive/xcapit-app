import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StartInvestingComponent } from './start-investing.component';

describe('StartInvestingComponent', () => {
  let component: StartInvestingComponent;
  let fixture: ComponentFixture<StartInvestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StartInvestingComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(StartInvestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
