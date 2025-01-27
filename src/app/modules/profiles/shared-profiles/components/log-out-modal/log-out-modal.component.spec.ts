import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { LogOutModalService } from '../../services/log-out-modal/log-out-modal.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

import { LogOutModalComponent } from './log-out-modal.component';

describe('LogOutModalComponent', () => {
  let component: LogOutModalComponent;
  let fixture: ComponentFixture<LogOutModalComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<LogOutModalComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let logOutModalSpy: jasmine.SpyObj<LogOutModalService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      logOutModalSpy = jasmine.createSpyObj('LogOutModalService', {
        addUserToNotShowModal: Promise.resolve(),
      });
      TestBed.configureTestingModule({
        declarations: [LogOutModalComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule, ReactiveFormsModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: LogOutModalService, useValue: logOutModalSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(LogOutModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log out when Log Out button clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Log Out"]')).nativeElement.click();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith(true);
    expect(logOutModalSpy.addUserToNotShowModal).toHaveBeenCalledTimes(0);
  });

  it('should log out and remember that user checked do not show this again when Log Out button clicked', async () => {
    component.username = 'testUser2';
    component.form.patchValue({ dontShowModalCheckbox: true });
    fixture.detectChanges();
    await component.logout();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith(true);
    expect(logOutModalSpy.addUserToNotShowModal).toHaveBeenCalledOnceWith('testUser2');
  });

  it('should call trackEvent on trackService when Log Out button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Log Out');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close modal and navigate to Wallet FAQs when Wallet FAQs button clicked', async () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Wallet FAQs');
    el.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/support/faqs/wallet']);
  });

  it('should call trackEvent on trackService when Wallet FAQs button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Wallet FAQs');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
