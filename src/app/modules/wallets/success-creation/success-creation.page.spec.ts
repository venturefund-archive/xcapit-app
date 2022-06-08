import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { SuccessCreationPage } from './success-creation.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { By } from '@angular/platform-browser';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

describe('SuccessCreationPage', () => {
  let component: SuccessCreationPage;
  let fixture: ComponentFixture<SuccessCreationPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessCreationPage>;
  let navControllerSpy: any;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
        trackEvent: Promise.resolve(true),
      });
      fakeModalController = new FakeModalController(null, {});
      modalControllerSpy = fakeModalController.createSpy();
      TestBed.configureTestingModule({
        declarations: [FakeTrackClickDirective, SuccessCreationPage],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessCreationPage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const imgEl = fixture.debugElement.query(By.css('.header__ux_success_image img'));
    const titleEl = fixture.debugElement.query(By.css('.main__primary_text ion-text'));
    const subtitleEl = fixture.debugElement.query(By.css('.main__secondary_text ion-text'));
    expect(imgEl.attributes.src).toContain('assets/img/wallets/success_creation.svg');
    expect(titleEl.nativeElement.innerHTML).toContain('wallets.success_creation.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('wallets.success_creation.subtitle');
  });

  it('should open modal when ux_create_skip Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_create_skip');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should go to protect wallet when ux_go_to_protect Item was clicked', () => {
    const el = fixture.debugElement.query(By.css('div.main__actions__primary'));
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/recovery/read']);
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
