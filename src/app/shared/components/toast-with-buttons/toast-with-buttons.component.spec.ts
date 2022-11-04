import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationExtras } from '@angular/router';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ToastWithButtonsComponent } from './toast-with-buttons.component';

describe('ToastWithButtonsComponent', () => {
  let component: ToastWithButtonsComponent;
  let fixture: ComponentFixture<ToastWithButtonsComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ToastWithButtonsComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [ToastWithButtonsComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: NavController, useValue: navControllerSpy },
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ToastWithButtonsComponent);
      component = fixture.componentInstance;
      component.text = 'test';
      component.primaryButtonText = 'button 1';
      component.secondaryButtonText = 'button 2';
      component.primaryButtonRoute = 'test/route/1';
      component.secondaryButtonRoute = 'test/route/2';
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when first_action Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'first_action');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when secondary_action Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'secondary_action');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close modal', async () => {
    fixture.debugElement.query(By.css('ion-icon[name="close-outline"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should navigate to primary link, emit event and dismiss modal', async () => {
    const spy = spyOn(component.primaryActionEvent, 'emit');
    fixture.debugElement.query(By.css('ion-button[name="first_action"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['test/route/1']);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to secondary link, emit event and dismiss modal', async () => {
    const spy = spyOn(component.secondaryActionEvent, 'emit');
    fixture.debugElement.query(By.css('ion-button[name="secondary_action"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['test/route/2']);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should hide primary button', () => {
    component.primaryButtonText = undefined;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('ion-button[name="first_action"]'));
    expect(el).toBeFalsy();
  });
});
