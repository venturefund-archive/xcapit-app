import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerifyPhrasePage } from './verify-phrase.page';

describe('VerifyPhrasePage', () => {
  let component: VerifyPhrasePage;
  let fixture: ComponentFixture<VerifyPhrasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyPhrasePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyPhrasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
