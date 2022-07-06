import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { ErrorNoWalletPage } from './error-no-wallet.page';

const testData = {
  image: '/assets/img/financial-education/error-no-wallet.svg',
  urlClose: '/financial-education/home',
  textPrimary: 'financial_education.error_no_wallet.textPrimary',
  textSecondary: 'financial_education.error_no_wallet.textSecondary',
  namePrimaryAction: 'financial_education.error_no_wallet.namePrimaryAction',
  nameSecondaryAction: 'financial_education.error_no_wallet.nameSecondaryAction',
  urlPrimaryAction: '/tabs/wallets',
  urlSecondaryAction: '/financial-education/home',
};

describe('ErrorNoWalletPage', () => {
  let component: ErrorNoWalletPage;
  let fixture: ComponentFixture<ErrorNoWalletPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ErrorNoWalletPage],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ErrorNoWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    component.data = testData;
    const appErrorContentEl = fixture.debugElement.query(By.css('app-success-content'));
    expect(appErrorContentEl).toBeTruthy();
  });
});
