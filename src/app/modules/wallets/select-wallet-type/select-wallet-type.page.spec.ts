import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { SelectWalletTypePage } from './select-wallet-type.page';
import { By } from '@angular/platform-browser';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { WalletInitializeProcess } from '../shared-wallets/services/wallet-initialize-process/wallet-initialize-process';

describe('SelectWalletTypePage', () => {
  let component: SelectWalletTypePage;
  let fixture: ComponentFixture<SelectWalletTypePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SelectWalletTypePage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let storageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let walletInitializeProcessServiceSpy: jasmine.SpyObj<WalletInitializeProcess>

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    storageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
    });
    walletInitializeProcessServiceSpy = jasmine.createSpyObj('WalletInitializeProcess', {
      setWarrantyWallet: Promise.resolve(),
    })

    TestBed.configureTestingModule({
      declarations: [SelectWalletTypePage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: IonicStorageService, useValue: storageServiceSpy },
        { provide: WalletInitializeProcess, useValue: walletInitializeProcessServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectWalletTypePage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to on-boarding when Close button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Close button"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['users/on-boarding']);
  });

  it('should navigate to password creation, save wallet type and call appTrackEvent on trackService when ux_create_select_warrant is clicked', fakeAsync(() => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('div', 'ux_create_select_warrant');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/create-password/create']);
    expect(walletInitializeProcessServiceSpy.setWarrantyWallet).toHaveBeenCalledOnceWith(true);
  }));

  it('should navigate to password creation, save wallet type and call appTrackEvent on trackService when ux_create_select_web3 is clicked', fakeAsync(() => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('div', 'ux_create_select_web3');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/create-password/create']);
    expect(walletInitializeProcessServiceSpy.setWarrantyWallet).toHaveBeenCalledOnceWith(false);
  }));
});
