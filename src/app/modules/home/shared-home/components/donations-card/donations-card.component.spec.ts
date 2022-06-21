import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { DonationsCardComponent } from './donations-card.component';

describe('DonationsCardComponent', () => {
  let component: DonationsCardComponent;
  let fixture: ComponentFixture<DonationsCardComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DonationsCardComponent>;
  let storageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    storageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: null
    });
    TestBed.configureTestingModule({
      declarations: [ DonationsCardComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{provide: NavController, useValue: navControllerSpy }, {provide: IonicStorageService, useValue: storageServiceSpy}]
    }).compileComponents();

    fixture = TestBed.createComponent(DonationsCardComponent);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate donations information tests page when user did not make introduction', async () => {
    const clickeableDiv = fixture.debugElement.query(By.css('div[name="ux_donations_go"]'));
    clickeableDiv.nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['donations/information']);
  });

  it('should not navigate to education tests page when user make introduction', async () => {
    storageServiceSpy.get.and.resolveTo(true);
    const clickeableDiv = fixture.debugElement.query(By.css('div[name="ux_donations_go"]'));
    clickeableDiv.nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['donations/causes']);
  });

  it('should render properly', async () => {
    const [titleEl, subtitleEl] = fixture.debugElement.queryAll(By.css('.dc__content__body ion-text'));
    const imgEl = fixture.debugElement.query(By.css('.dc__content__img')); 
    expect(titleEl.nativeElement.innerHTML).toContain('home.home_page.donations_card.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('home.home_page.donations_card.subtitle');
    expect(imgEl.attributes.src).toContain("/assets/img/home/donations.svg");
  });
});
