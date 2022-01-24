import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { RemoveWalletPage } from './remove-wallet.page';

describe('RemoveWalletPage', () => {
  let component: RemoveWalletPage;
  let fixture: ComponentFixture<RemoveWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RemoveWalletPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        removeWalletFromStorage: Promise.resolve(),
      });
      TestBed.configureTestingModule({
        declarations: [RemoveWalletPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: StorageService, useValue: storageServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(RemoveWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should activated button when checkbox is checked', async () => {
    fixture.debugElement.query(By.css("ion-checkbox[name='checkbox-condition']")).nativeElement.click();
    const buttonEl = fixture.debugElement.query(By.css("ion-button[name='remove_wallet']"));
    fixture.detectChanges();
    expect(buttonEl.properties.disabled).toBe(false);
  });

  it('should disabled button when checkbox is not checked', () => {
    const buttonEl = fixture.debugElement.query(By.css("ion-button[name='remove_wallet']"));
    expect(buttonEl.properties.disabled).toBe(true);
  });

  it('should remove wallet and navigate to success page when checkbox is checked and button remove_wallet is clicked', () => {
    fixture.debugElement.query(By.css("ion-checkbox[name='checkbox-condition']")).nativeElement.click();
    fixture.debugElement.query(By.css("ion-button[name='remove_wallet']")).nativeElement.click();
    expect(storageServiceSpy.removeWalletFromStorage).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/remove/success']);
  });
});
