import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';

import { NewCreateSupportTicketPage } from './new-create-support-ticket.page';

describe('NewCreateSupportTicketPage', () => {
  let component: NewCreateSupportTicketPage;
  let fixture: ComponentFixture<NewCreateSupportTicketPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let fakeWalletService: FakeWalletService;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    fakeWalletService = new FakeWalletService(true);
    walletServiceSpy = fakeWalletService.createSpy();
    TestBed.configureTestingModule({
      declarations: [ NewCreateSupportTicketPage ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(),],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: WalletService, useValue: walletServiceSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewCreateSupportTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to ticket creation success when Submit button is clicked and ticket is created and wallet exists', async() => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-create-ticket-form')).triggerEventHandler('success');
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tickets/new-success-wallet'], {replaceUrl: true});
  });

  it('should navigate to ticket creation success when Submit button is clicked and ticket is created and wallet does not exist', async() => {
    fakeWalletService.modifyReturns(false, null);
    component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-create-ticket-form')).triggerEventHandler('success');
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tickets/new-success'], {replaceUrl: true});
  });
});
