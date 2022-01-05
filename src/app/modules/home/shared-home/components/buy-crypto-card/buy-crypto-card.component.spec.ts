import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BuyCryptoCardComponent } from './buy-crypto-card.component';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';

describe('BuyCryptoCardComponent', () => {
  let component: BuyCryptoCardComponent;
  let fixture: ComponentFixture<BuyCryptoCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<BuyCryptoCardComponent>;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  beforeEach(
    waitForAsync(() => {
      fakeWalletService = new FakeWalletService(true);
      walletServiceSpy = fakeWalletService.createSpy();
      TestBed.configureTestingModule({
        declarations: [BuyCryptoCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [{ provide: WalletService, useValue: walletServiceSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(BuyCryptoCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on card click', async () => {
    const spy = spyOn(component.clicked, 'emit');
    await fixture.whenRenderingDone();
    fixture.debugElement.query(By.css('.bcc')).nativeElement.click();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Buy Crypto button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'Buy Crypto');
    const directive = trackClickDirectiveHelper.getDirective(el);

    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
