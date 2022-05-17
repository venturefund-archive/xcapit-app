import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { UpdateAppModalComponent } from './update-app-modal.component';

describe('UpdateAppModalComponent', () => {
  let component: UpdateAppModalComponent;
  let fixture: ComponentFixture<UpdateAppModalComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UpdateAppModalComponent>;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      TestBed.configureTestingModule({
        declarations: [UpdateAppModalComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ModalController, useValue: modalControllerSpy }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(UpdateAppModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal when Close button clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith(false);
  });

  it('should open store when Update App button clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Update App"]')).nativeElement.click();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith(true);
  });

  it('should close modal when Remind Me Later button clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Remind Me Later"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith(false);
  });

  it('should call trackEvent on trackService when Close is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Update App is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Update App');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Remind Me Later is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Remind Me Later');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
