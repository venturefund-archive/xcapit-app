import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { HomePage } from './home-page.page';
import { TranslateModule } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of, Subscription } from 'rxjs';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HomePage>;
  let navControllerSpy: any;
  let notificationsService: NotificationsService;
  let notificationsServiceMock: any;
  let windowSpy: any;

  beforeEach(
    waitForAsync(() => {
      windowSpy = spyOn(window, 'open');
      notificationsServiceMock = {
        getCountNotifications: () => of({ count: 5 }),
      };
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [HomePage, FakeTrackClickDirective],
        imports: [HttpClientTestingModule, IonicModule, TranslateModule.forRoot()],
        providers: [
          {
            provide: NavController,
            useValue: navControllerSpy,
          },
          {
            provide: NotificationsService,
            useValue: notificationsServiceMock,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(HomePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      notificationsService = TestBed.inject(NotificationsService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Show Notifications button clicked', () => {
    spyOn(component, 'showNotifications');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Show Notifications');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to notifications list when Show Notifications is clicked', () => {
    const button = fixture.debugElement.query(By.css("ion-button[name='Show Notifications']"));
    button.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/notifications/list');
  });

  it('should unsubscribe timerSubscription, notificationQtySubscription on ionViewDidLeave', () => {
    component.ionViewWillEnter();
    const spy = spyOn(Subscription.prototype, 'unsubscribe');
    component.ionViewDidLeave();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
