import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { ContactSupportComponent } from './contact-support.component';

describe('ContactSupportComponent', () => {
  let component: ContactSupportComponent;
  let fixture: ComponentFixture<ContactSupportComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ContactSupportComponent>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(
    waitForAsync(() => {
      remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
        getFeatureFlag: false
      });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [ContactSupportComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ContactSupportComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to create-ticket-support when Go To Create Ticket is clicked and feature flag is false', () => {
    fixture.debugElement.query(By.css('ion-button[name="Go To Create Ticket"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tickets/create-support-ticket');
  });

  it('should navigate to new-create-ticket-support when Go To Create Ticket is clicked and feature flag is true', () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(true);
    fixture.debugElement.query(By.css('ion-button[name="Go To Create Ticket"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tickets/new-create-support-ticket');
  });

  it('should call trackEvent on trackService when Go To Create Ticket clicked', async () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Create Ticket');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});