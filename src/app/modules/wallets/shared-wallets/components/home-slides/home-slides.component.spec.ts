import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { SwiperModule } from 'swiper/angular';
import { HomeSlidesComponent } from './home-slides.component';
const testSliders = [
  {
    image: 'test-image-3',
    url: '/wallets/receive/select-currency',
    isBrowserOpen: false,
    isModalOpen: false,
  },
  {
    image: 'test-image-2',
    url: 'test.com',
    isBrowserOpen: false,
    isModalOpen: true,
  },
  {
    image: 'test-image-3',
    url: 'test.com',
    isBrowserOpen: true,
    isModalOpen: false,
  },
]
describe('HomeSlidesComponent', () => {
  let component: HomeSlidesComponent;
  let fixture: ComponentFixture<HomeSlidesComponent>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    TestBed.configureTestingModule({
      declarations: [HomeSlidesComponent],
      imports: [IonicModule.forRoot(), SwiperModule, TranslateModule.forRoot()],
      providers: [
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
      ],

    }).compileComponents();

    fixture = TestBed.createComponent(HomeSlidesComponent);
    component = fixture.componentInstance;
    component.slides = testSliders;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly swiper and sliders', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();
    const swiperEl = fixture.debugElement.query(By.css('swiper.hs__swiper'));
    const [slider1, slider2, slider3] = fixture.debugElement.queryAll(By.css('div[class="hs__swiper__slide"]'));
    expect(slider1).toBeTruthy();
    expect(slider2).toBeTruthy();
    expect(slider3).toBeTruthy();
    expect(swiperEl).toBeTruthy();
  });

  it('should navigate properly when isBrowserOpen is false or true', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();
    const [slider1, slider2, slider3] = fixture.debugElement.queryAll(By.css('div[class="hs__swiper__slide"]'));
    slider1.nativeElement.click();
    slider2.nativeElement.click();
    slider3.nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith('/wallets/receive/select-currency')
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: 'test.com' });
    expect(browserServiceSpy.open).toHaveBeenCalledTimes(1);
   });

   it('should track event when slider is clicked', () => {
    const slider1 = fixture.debugElement.query(By.css('div[class="hs__swiper__slide"]'));
    slider1.nativeElement.click();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

});
