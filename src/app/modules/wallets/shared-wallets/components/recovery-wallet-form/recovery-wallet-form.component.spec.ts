import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecoveryWalletFormComponent } from './recovery-wallet-form.component';

describe('RecoveryWalletFormComponent', () => {
  let component: RecoveryWalletFormComponent;
  let fixture: ComponentFixture<RecoveryWalletFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecoveryWalletFormComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoveryWalletFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
