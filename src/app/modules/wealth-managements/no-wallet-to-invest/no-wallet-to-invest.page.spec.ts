import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NoWalletToInvestPage } from './no-wallet-to-invest.page';

describe('NoWalletToInvestPage', () => {
  let component: NoWalletToInvestPage;
  let fixture: ComponentFixture<NoWalletToInvestPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NoWalletToInvestPage],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(NoWalletToInvestPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
