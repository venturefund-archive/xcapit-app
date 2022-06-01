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

const formValid = {
  agreeSkipBackUp : true,
};

describe('SkipBackupModalComponent', () => {
  let component: SkipBackupModalComponent;
  let fixture: ComponentFixture<SkipBackupModalComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SkipBackupModalComponent>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    fakeModalController = new FakeModalController(null, {});
    modalControllerSpy = fakeModalController.createSpy();
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [ SkipBackupModalComponent, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
      providers:[{provide:NavController,useValue:navControllerSpy},
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(SkipBackupModalComponent);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not proceed if the checkboxes are not checked', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_create_skip_warning"]'));
    expect(buttonEl.nativeNode.disabled).toBeTruthy();
  });

  it('should proceed if all the checkboxes are checked', () => {
    component.skipBackUpForm.patchValue({
      agreeSkipBackUp: true,
    });
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_create_skip_warning"]'));
    const directive = trackClickDirectiveHelper.getDirective(buttonEl);
    const spy = spyOn(directive, 'clickEvent');
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(buttonEl.nativeNode.disabled).toBeFalsy();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
  });

  it('should close modal', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="CancelSkip"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should set storage when form is valid and click ux_create_skip_warning button ', () => {
    component.skipBackUpForm.patchValue({formValid});
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_create_skip_warning"]'));
    buttonEl.nativeElement.click();

    fixture.detectChanges();
    
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledTimes(1);
  });
});
