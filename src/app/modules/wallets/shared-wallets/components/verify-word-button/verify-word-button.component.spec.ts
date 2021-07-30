import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerifyWordButtonComponent } from './verify-word-button.component';

describe('VerifyWordButtonComponent', () => {
  let component: VerifyWordButtonComponent;
  let fixture: ComponentFixture<VerifyWordButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyWordButtonComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyWordButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
