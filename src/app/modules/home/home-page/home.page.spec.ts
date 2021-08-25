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
import { of } from 'rxjs';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HomePage>;
  let navControllerSpy: any;
  let apiWebflowService: ApiWebflowService;
  let apiWebflowServiceMock: any;
  let notificationsServiceMock: any;
  let windowSpy: any;

  beforeEach(
    waitForAsync(() => {
      windowSpy = spyOn(window, 'open');

      apiWebflowServiceMock = {
        getNews: () => of([]),
      };
      notificationsServiceMock = {
        getNotifications: () => of({}),
        getCountNotifications: () => of({}),
      };
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [HomePage, TrackClickDirective],
        imports: [HttpClientTestingModule, IonicModule.forRoot(), TranslateModule.forRoot()],
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
    expect(window.open).toHaveBeenCalledOnceWith('https://www.xcapit.com/#lista-espera', '_blank');
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
    const IWantMyWalletButton = fixture.debugElement.query(By.css("div[name='Go to Support Page']"));
    IWantMyWalletButton.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tickets/create-support-ticket']);
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

  it('should call trackEvent on trackService when Go To Profile button clicked', () => {
    spyOn(component, 'goToProfile');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Profile');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getNews on doRefresh', async () => {
    const spyNews = spyOn(apiWebflowService, 'getNews');
    spyNews.and.returnValue(of([]));
    await component.doRefresh({ target: { complete: () => null } });
    expect(spyNews).toHaveBeenCalledTimes(1);
  });

  it('should call getNews, createNotificationTimer and initQtyNotifications on ionViewWillEnter', async () => {
    const spyNews = spyOn(apiWebflowService, 'getNews');
    spyNews.and.returnValue(of([]));
    const spyCreateNotificationTimer = spyOn(component, 'createNotificationTimer');
    const spyInitQtyNotification = spyOn(component, 'initQtyNotifications');
    await component.ionViewWillEnter();
    expect(spyCreateNotificationTimer).toHaveBeenCalledTimes(1);
    expect(spyInitQtyNotification).toHaveBeenCalledTimes(1);
    expect(spyNews).toHaveBeenCalledTimes(1);
  });
});
