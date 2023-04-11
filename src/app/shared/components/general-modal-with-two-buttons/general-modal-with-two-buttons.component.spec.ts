import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { LINKS } from 'src/app/config/static-links';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { BrowserService } from '../../services/browser/browser.service';
import { TrackService } from '../../services/track/track.service';
import { GeneralModalWithTwoButtonsComponent } from './general-modal-with-two-buttons.component';

describe('GeneralModalWithTwoButtonsComponent', () => {
  let component: GeneralModalWithTwoButtonsComponent;
  let fixture: ComponentFixture<GeneralModalWithTwoButtonsComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<GeneralModalWithTwoButtonsComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [GeneralModalWithTwoButtonsComponent, FakeTrackClickDirective],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralModalWithTwoButtonsComponent);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Close clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close informative modal when Close clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should open Naranja X main page when Go To Kripton link is clicked', () => {
    fixture.debugElement.query(By.css('ion-text[name="Go To More Info"]')).nativeElement.click();
    fixture.detectChanges();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: LINKS.naranjax });
  });

  it('should open Naranja X main page when Go To Kripton link is clicked', () => {
    fixture.debugElement.query(By.css('ion-text[name="Go To More Info"]')).nativeElement.click();
    fixture.detectChanges();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: LINKS.naranjax });
  });

  it('should track event when first button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="firstButton"]')).nativeElement.click();
    fixture.detectChanges();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should track event when second button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="secondButton"]')).nativeElement.click();
    fixture.detectChanges();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate to page when first button is clicked and dismiss modal', async () => {
    fixture.debugElement.query(By.css('ion-button[name="firstButton"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(component.urlFirstButton);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
  
  it('should navigate to page when second button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="secondButton"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(component.urlSecondButton);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
