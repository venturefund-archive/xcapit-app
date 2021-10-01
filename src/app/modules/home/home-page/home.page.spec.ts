import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HomePage } from './home-page.page';
import { TranslateModule } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { ApiWebflowService } from 'src/app/shared/services/api-webflow/api-webflow.service';
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
  let apiWebflowService: ApiWebflowService;
  let apiWebflowServiceMock: any;
  let notificationsService: NotificationsService;
  let notificationsServiceMock: any;
  let windowSpy: any;

  beforeEach(
    waitForAsync(() => {
      windowSpy = spyOn(window, 'open');

      apiWebflowServiceMock = {
        getNews: () => of(['test new']),
      };
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
            provide: ApiWebflowService,
            useValue: apiWebflowServiceMock,
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
      apiWebflowService = TestBed.inject(ApiWebflowService);
      notificationsService = TestBed.inject(NotificationsService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Go to Wallet is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'Go to Wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should open in app browser when Go to Wallet is clicked', async () => {
    const IWantMyWalletButton = fixture.debugElement.query(By.css("div[name='Go to Wallet']"));
    IWantMyWalletButton.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tabs/wallets');
  });

  it('should call trackEvent on trackService when Go to Support Page is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'Go to Support Page');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate to create-support-ticket when Go to Support Page is clicked', () => {
    const button = fixture.debugElement.query(By.css("div[name='Go to Support Page']"));
    button.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tickets/create-support-ticket');
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

  it('should call getNews on doRefresh', async () => {
    const spyNews = spyOn(apiWebflowService, 'getNews');
    spyNews.and.returnValue(of([]));
    await component.doRefresh({ target: { complete: () => null } });
    expect(spyNews).toHaveBeenCalledTimes(1);
  });

  it('should call getNews, createNotificationTimer and initQtyNotifications on ionViewWillEnter', () => {
    component.ionViewWillEnter();

    expect(component.news).toEqual(['test new']);
    expect(component.unreadNotifications).toEqual(5);
  });

  it('should unsubscribe timerSubscription, notificationQtySubscription on ionViewDidLeave', () => {
    component.ionViewWillEnter();
    const spy = spyOn(Subscription.prototype, 'unsubscribe');
    component.ionViewDidLeave();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
