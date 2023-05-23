import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { ChangeProfileTypeModalComponent } from './change-profile-type-modal.component';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { By } from '@angular/platform-browser';

describe('ChangeProfileTypeModalComponent', () => {
  let component: ChangeProfileTypeModalComponent;
  let fixture: ComponentFixture<ChangeProfileTypeModalComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ChangeProfileTypeModalComponent>;

  beforeEach(waitForAsync(() => {

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    fakeModalController = new FakeModalController(null, {});
    modalControllerSpy = fakeModalController.createSpy();

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [ ChangeProfileTypeModalComponent, FakeTrackClickDirective ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeProfileTypeModalComponent);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when back button is clicked', async () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_toast_send_go_back');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when switch profile button is clicked', async () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_toast_send_switch');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should close modal', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_toast_send_go_back"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should set storage and navigate', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_toast_send_switch"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledOnceWith('warranty_wallet', false);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('/tabs/wallets');
  });
});
