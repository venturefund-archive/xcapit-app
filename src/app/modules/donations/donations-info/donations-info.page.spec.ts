import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { DonationsInfoPage } from './donations-info.page';

describe('DonationsInfoPage', () => {
  let component: DonationsInfoPage;
  let fixture: ComponentFixture<DonationsInfoPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DonationsInfoPage>;
  let storageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  beforeEach(
    waitForAsync(() => {
      storageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
        set: Promise.resolve(),
      });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [DonationsInfoPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy },  { provide: IonicStorageService, useValue: storageServiceSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(DonationsInfoPage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const imgEl = fixture.debugElement.query(By.css('.di__content__img img'));
    const titleEl = fixture.debugElement.query(By.css('.di__content__title ion-text'));
    const [textItem1, textItem2] = fixture.debugElement.queryAll(By.css('div.di__content__items__item ion-text'));
    const [imgItem1, imgItem2] = fixture.debugElement.queryAll(By.css('div.di__content__items__item img'));

    expect(imgEl.attributes.src).toContain('assets/img/donations/information/information.svg');
    expect(titleEl.nativeElement.innerHTML).toContain('donations.information.title');
    expect(textItem1.nativeElement.innerHTML).toContain('donations.information.item_1');
    expect(textItem2.nativeElement.innerHTML).toContain('donations.information.item_2');
    expect(imgItem1.attributes.src).toContain('assets/img/donations/information/item_1.svg');
    expect(imgItem2.attributes.src).toContain('assets/img/donations/information/item_2.svg');
  });

  it('should call appTrackEvent on trackService when ux_donations_start is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_donations_start');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to causes and set storage when button is clicked', () => {
    fixture.debugElement.query(By.css('.di__button ion-button')).nativeElement.click();

    fixture.detectChanges();
    expect(storageServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/donations/causes']);
  });
});
