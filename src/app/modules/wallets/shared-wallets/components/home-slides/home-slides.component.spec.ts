import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { SwiperModule } from 'swiper/angular';
import { HomeSlidesComponent } from './home-slides.component';
const testSliders = [
  {
    image: 'test-image-3',
    url: '/wallets/receive/select-currency',
    isBrowserOpen: false,
  },
  {
    image: 'test-image-2',
    url: 'test.com',
    isBrowserOpen: true,
  },
  {
    image: 'test-image-3',
    url: 'test.com',
    isBrowserOpen: true,
  },
]
describe('HomeSlidesComponent', () => {
  let component: HomeSlidesComponent;
  let fixture: ComponentFixture<HomeSlidesComponent>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  
  beforeEach(waitForAsync(() => {
    
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      declarations: [HomeSlidesComponent],
      imports: [IonicModule.forRoot(), SwiperModule],
      providers: [
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
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
    const [slider1, slider2] = fixture.debugElement.queryAll(By.css('div[class="hs__swiper__slide"]'));
    slider1.nativeElement.click();
    slider2.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/wallets/receive/select-currency')
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'test.com' });
   });

});
