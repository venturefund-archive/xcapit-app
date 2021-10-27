import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecoveryPhraseReadPage } from './recovery-phrase-read.page';

describe('RecoveryPhraseReadPage', () => {
  let component: RecoveryPhraseReadPage;
  let fixture: ComponentFixture<RecoveryPhraseReadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecoveryPhraseReadPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoveryPhraseReadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
