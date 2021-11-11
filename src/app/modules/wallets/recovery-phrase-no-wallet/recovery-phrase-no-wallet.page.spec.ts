import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecoveryPhraseNoWalletPage } from './recovery-phrase-no-wallet.page';

describe('RecoveryPhraseNoWalletPage', () => {
  let component: RecoveryPhraseNoWalletPage;
  let fixture: ComponentFixture<RecoveryPhraseNoWalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecoveryPhraseNoWalletPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoveryPhraseNoWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
