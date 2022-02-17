import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { UrlSerializer } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { By } from '@angular/platform-browser';

import { WalletConnectCardComponent } from './wallet-connect-card.component';

describe('WalletConnectCardComponent', () => {
  let component: WalletConnectCardComponent;
  let fixture: ComponentFixture<WalletConnectCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let fakeWalletService: FakeWalletService;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      fakeWalletService = new FakeWalletService(true);
      walletServiceSpy = fakeWalletService.createSpy();
      walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', { connected: false });
      TestBed.configureTestingModule({
        declarations: [WalletConnectCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          UrlSerializer,
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: WalletConnectService, useValue: walletConnectServiceSpy}
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletConnectCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should navigate to no wallet when wallet does not exists', async () => {
    fakeWalletService.modifyReturns(false, {});
    fixture.debugElement.query(By.css('div[name="Go To WalletConnect"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/no-wallet']);
  })

  it('shoud navigate to WalletConnect new-connection when wallet exists and walletconnect service is not connected', async () => {
    walletConnectServiceSpy.connected = false;
    fixture.debugElement.query(By.css('div[name="Go To WalletConnect"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/wallet-connect/new-connection']);
  })

  it('should navidate to WalletConnect connection-detail when wallet exists and walletconnect service is connected', async () => {
    walletConnectServiceSpy.connected = true;
    fixture.debugElement.query(By.css('div[name="Go To WalletConnect"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/wallet-connect/connection-detail']);
  })
});
