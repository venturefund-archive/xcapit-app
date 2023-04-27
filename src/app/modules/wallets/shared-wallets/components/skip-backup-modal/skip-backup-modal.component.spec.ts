import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { SkipBackupModalComponent } from './skip-backup-modal.component';

describe('SkipBackupModalComponent', () => {
  let component: SkipBackupModalComponent;
  let fixture: ComponentFixture<SkipBackupModalComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SkipBackupModalComponent>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
        trackEvent: Promise.resolve(true),
      });
      fakeModalController = new FakeModalController(null, {});
      modalControllerSpy = fakeModalController.createSpy();
      ionicStorageServiceSpy = jasmine.createSpyObj('StorageService', {
        set: Promise.resolve(false),
        get: Promise.resolve(),
      });
      TestBed.configureTestingModule({
        declarations: [SkipBackupModalComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: IonicStorageService, useValue: ionicStorageServiceSpy }
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SkipBackupModalComponent);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep button disabled if the checkboxes are not checked', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_create_skip_warning"]'));
    expect(buttonEl.nativeNode.disabled).toBeTruthy();
  });

  it('should not navigate when form is not valid and skip button is clicked', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.debugElement.query(By.css('ion-button[name="ux_create_skip_warning"]')).nativeElement.click();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(0);
  });

  it('should call trackEvent on trackService when skip backup button is clicked', async () => {
    component.skipBackUpForm.patchValue({
      agreeSkipBackUp: true,
    });
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_create_skip_warning');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should close modal', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="CancelSkip"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should change primary url when profile test is completed', async() => {
    ionicStorageServiceSpy.get.and.resolveTo(true);
    component.skipBackUpForm.patchValue({
      agreeSkipBackUp: true,
    });
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.debugElement.query(By.css('ion-button[name="ux_create_skip_warning"]')).nativeElement.click();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tabs/wallets'])
  });
});
