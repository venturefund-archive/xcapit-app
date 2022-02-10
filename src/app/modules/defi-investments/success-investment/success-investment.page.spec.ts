import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { SuccessInvestmentPage } from './success-investment.page';

describe('SuccessInvestmentPage', () => {
  let component: SuccessInvestmentPage;
  let fixture: ComponentFixture<SuccessInvestmentPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessInvestmentPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [SuccessInvestmentPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessInvestmentPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Close is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go To Investments is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Investments');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go To Wallet is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate to urlClose when Close is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css("ion-button[name='Close']"));
    closeButton.nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['tabs/home']);
  });

  it('should navigate to urlPage when Go To Investments is clicked', () => {
    const pageButton = fixture.debugElement.query(By.css("ion-button[name='Go To Investments']"));
    pageButton.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['tabs/investments/defi'], {replaceUrl : true});
  });

  it('should navigate to urlLink when Go To Wallet is clicked', () => {
    const pageButton = fixture.debugElement.query(By.css("ion-button[name='Go To Wallet']"));
    pageButton.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['tabs/wallets']);
  });
});
