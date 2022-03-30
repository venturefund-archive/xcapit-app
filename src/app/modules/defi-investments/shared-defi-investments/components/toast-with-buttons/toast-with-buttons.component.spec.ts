import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationExtras } from '@angular/router';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ToastWithButtonsComponent } from './toast-with-buttons.component';

const dataTest = {
  id: 16,
  name: 'MATIC - Polygon',
  logoRoute: 'assets/img/coins/MATIC.png',
  value: 'MATIC',
  network: 'MATIC',
  chainId: 80001,
  rpc: '',
  decimals: 18,
  native: true,
};

describe('ToastWithButtonsComponent', () => {
  let component: ToastWithButtonsComponent;
  let fixture: ComponentFixture<ToastWithButtonsComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ToastWithButtonsComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [ToastWithButtonsComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: NavController, useValue: navControllerSpy },
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ToastWithButtonsComponent);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component.data = dataTest;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when first_action Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'first_action');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when secondary_action Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'secondary_action');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close modal', async () => {
    fixture.debugElement.query(By.css('ion-icon[name="close-outline"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should navigate to moonpay page and close modal', async () => {
    component.firstLink = '/test/firstLink'
    fixture.debugElement.query(By.css('ion-button[name="first_action"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/test/firstLink']);
  });

  it('should navigate to receive page and close modal', async () => {
    component.secondLink = '/test/secondLink'
    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: 'MATIC',
        network: 'MATIC',
      },
    };
    fixture.debugElement.query(By.css('ion-button[name="secondary_action"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/test/secondLink'], navigationExtras);
  });
});
