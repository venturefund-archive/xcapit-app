import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { WalletAdviceComponent } from './wallet-advice.component';
const testData = {
  icon: 'ux-device',
  text: 'wallets.disclaimer.wallet_term_text',
  link: 'wallets.disclaimer.wallet_term_link',
};
describe('WalletAdviceComponent', () => {
  let component: WalletAdviceComponent;
  let fixture: ComponentFixture<WalletAdviceComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletAdviceComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [WalletAdviceComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletAdviceComponent);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component.logo = testData.icon;
      component.text = testData.text;
      component.link = testData.text;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly text of component', async () => {
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const textEl = fixture.debugElement.query(By.css('.text'));
    expect(textEl).toBeTruthy();
    expect(textEl.nativeElement.innerHTML).toContain('wallets.disclaimer.wallet_term_text');
  });

  it('should render properly image of component', async () => {
    fixture.detectChanges();

    const imageEl = fixture.debugElement.query(By.css('.image'));
    expect(imageEl).toBeTruthy();
    expect(imageEl.attributes['ng-reflect-name']).toEqual('ux-device');
  });

  it('should render properly button of component', async () => {
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="go_to_wallet_faqs"'));
    expect(buttonEl).toBeTruthy();
  });

  it('should navigate to wallet faqs when go_to_wallet_faqs button is clicked', () => {
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="go_to_wallet_faqs"'));
    buttonEl.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['support/wallet']);
  });

  it('should call appTrackEvent on trackService when ux_create_go_to_home_wallet is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'go_to_wallet_faqs');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
