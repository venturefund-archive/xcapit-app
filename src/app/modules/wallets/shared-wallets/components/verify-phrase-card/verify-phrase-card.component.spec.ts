import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerifyPhraseCardComponent } from './verify-phrase-card.component';

describe('VerifyPhraseCardComponent', () => {
  let component: VerifyPhraseCardComponent;
  let fixture: ComponentFixture<VerifyPhraseCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyPhraseCardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyPhraseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
