import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ErrorRecoveryWalletPage } from './error-recovery-wallet.page';

describe('ErrorRecoveryWalletPage', () => {
  let component: ErrorRecoveryWalletPage;
  let fixture: ComponentFixture<ErrorRecoveryWalletPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ErrorRecoveryWalletPage],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ErrorRecoveryWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
