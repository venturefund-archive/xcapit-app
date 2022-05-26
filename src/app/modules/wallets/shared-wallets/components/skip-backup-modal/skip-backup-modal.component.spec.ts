import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { SkipBackupModalComponent } from './skip-backup-modal.component';

describe('SkipBackupModalComponent', () => {
  let component: SkipBackupModalComponent;
  let fixture: ComponentFixture<SkipBackupModalComponent>;
  let navControllerSpy:any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SkipBackupModalComponent>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(waitForAsync(() => {
    navControllerSpy=jasmine.createSpyObj('NavController', navControllerMock)
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    fakeModalController = new FakeModalController(null, {});
    modalControllerSpy = fakeModalController.createSpy();

    TestBed.configureTestingModule({
      declarations: [ SkipBackupModalComponent, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
      providers:[{provide:NavController,useValue:navControllerSpy},
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },]
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

});
