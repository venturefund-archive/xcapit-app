import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecoveryPhrasePage } from './recovery-phrase.page';

describe('RecoveryPhrasePage', () => {
  let component: RecoveryPhrasePage;
  let fixture: ComponentFixture<RecoveryPhrasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecoveryPhrasePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoveryPhrasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
