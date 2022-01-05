import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { NoWalletPage } from './no-wallet.page';

describe('NoWalletPage', () => {
  let component: NoWalletPage;
  let fixture: ComponentFixture<NoWalletPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [NoWalletPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(NoWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to wallet menu when Go To Create Wallet button is clicked', async () => {
    fixture.debugElement.query(By.css("ion-button[name='Go To Create Wallet']")).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['tabs/wallets']);
  });

  it('should navigate to home when Close button is clicked', async () => {
    fixture.debugElement.query(By.css("ion-button[name='Close']")).nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['tabs/home']);
  });
});
