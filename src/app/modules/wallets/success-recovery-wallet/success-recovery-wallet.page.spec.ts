import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuccessRecoveryWalletPage } from './success-recovery-wallet.page';

describe('SuccessRecoveryWalletPage', () => {
  let component: SuccessRecoveryWalletPage;
  let fixture: ComponentFixture<SuccessRecoveryWalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessRecoveryWalletPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessRecoveryWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
