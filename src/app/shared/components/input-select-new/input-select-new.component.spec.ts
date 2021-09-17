import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InputSelectNewComponent } from './input-select-new.component';

describe('InputSelectNewComponent', () => {
  let component: InputSelectNewComponent;
  let fixture: ComponentFixture<InputSelectNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputSelectNewComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(InputSelectNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
