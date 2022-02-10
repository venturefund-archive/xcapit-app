import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { NoWalletComponent } from './no-wallet.component';

const testData = {
  urlClose: '/tabs/home',
  urlPage: '/tabs/wallets',
  urlLink: '/tabs/investments/defi',
  img: 'assets/img/wealth_management/no-wallet.svg',
  title: 'test.test.title',
  subtitle: 'test.test.subtitle',
  nameButton: 'test.test.button',
  nameLink: 'test.test.link',
};

describe('NoWalletComponent', () => {
  let component: NoWalletComponent;
  let fixture: ComponentFixture<NoWalletComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<NoWalletComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [NoWalletComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(NoWalletComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component.data = testData;
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

  it('should call trackEvent on trackService when Go To Page is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Page');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go To Link is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Link');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate to urlClose when Close is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css("ion-button[name='Close']"));
    closeButton.nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith([component.data.urlClose]);
  });

  it('should navigate to urlPage when Go To Page is clicked', () => {
    const pageButton = fixture.debugElement.query(By.css("ion-button[name='Go To Page']"));
    pageButton.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlPage]);
  });

  it('should navigate to urlLink when Go To Link is clicked', () => {
    const pageButton = fixture.debugElement.query(By.css("ion-button[name='Go To Link']"));
    pageButton.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlLink], {replaceUrl : true});
  });
});
