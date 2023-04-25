import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { OperationKmInProgressModalComponent } from './operation-km-in-progress-modal.component';

const testData = {
    urlClose: '/fiat-ramps/purchases',
    image: '/assets/img/fiat-ramps/opeartion-km-in-progress/operation-km-in-progress.svg',
    icon: '/assets/img/fiat-ramps/opeartion-km-in-progress/operation-icon.svg',
    titlePrimary: 'fiat_ramps.operation_km_in_progress.text_title',
    textBadge: 'fiat_ramps.operation_km_in_progress.text_badge',
    textPrimary: 'fiat_ramps.operation_km_in_progress.text_primary',
    textSecondary: 'fiat_ramps.operation_km_in_progress.text_secondary',
    textTertiary: 'fiat_ramps.operation_km_in_progress.text_tertiary',
    namePrimaryAction: 'fiat_ramps.operation_km_in_progress.button_text',
    urlPrimaryAction: '/fiat-ramps/purchases',
    textHelpLink: 'fiat_ramps.operation_km_in_progress.text_help_link',
}

describe('OperationKmInProgressModalComponent', () => {
  let component: OperationKmInProgressModalComponent;
  let fixture: ComponentFixture<OperationKmInProgressModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(waitForAsync(() => {
    fakeActivatedRoute = new FakeActivatedRoute();
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', { trackEvent: Promise.resolve(true) }) 
    browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });

    TestBed.configureTestingModule({
      declarations: [ OperationKmInProgressModalComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        UrlSerializer,
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy},
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: TrackService, useValue: trackServiceSpy}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationKmInProgressModalComponent);
    component = fixture.componentInstance;
    component.data = testData;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to purchases page when Close Success button is clicked', () => {
    const closeButtonEl = fixture.debugElement.query(By.css("ion-button[name='Close Success']"));
    closeButtonEl.nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlClose]);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should navigate to purchases page when Success Action Primary is clicked', () => {
    const primaryButtonEl = fixture.debugElement.query(By.css("ion-button[name='Success Action Primary']"));
    primaryButtonEl.nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlPrimaryAction]);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should open browser in app on terms and conditions page when help-kripton button is clicked', () => {
    const tycItem = fixture.debugElement.query(By.css('ion-button[name="kripton-tyc"]'));
    tycItem.nativeElement.click();
    fixture.detectChanges();
    expect(browserServiceSpy.open).toHaveBeenCalledTimes(1);
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: 'https://kriptonmarket.com' });
  });

  it('should track screenview event on init if it has data to track', () => {
    component.data.hasToTrackScreenview = true
    component.data.screenviewEventLabel = 'test'
    component.ngOnInit();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
