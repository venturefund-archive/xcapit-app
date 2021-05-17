import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformativeModalComponent } from './informative-modal.component';

describe('InformativeModalComponent', () => {
  let component: InformativeModalComponent;
  let fixture: ComponentFixture<InformativeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InformativeModalComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(InformativeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
