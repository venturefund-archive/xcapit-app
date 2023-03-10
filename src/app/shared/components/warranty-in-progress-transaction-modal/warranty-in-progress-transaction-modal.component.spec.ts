import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { WarrantyInProgressTransactionModalComponent } from './warranty-in-progress-transaction-modal.component';
import { FakeFeatureFlagDirective } from '../../../../testing/fakes/feature-flag-directive.fake.spec';
import { TrackService } from '../../services/track/track.service';

describe('WarrantyInProgressTransactionModalComponent', () => {
  const testData = {
    image: 'assets/test_image.svg',
    icon: 'assets/test_icon.svg',
    iconTertiary: 'assets/test_icon.svg',
    urlClose: '/tabs/wallets',
    textPrimary: 'textPrimary',
    textSecondary: 'textSecondary',
    textTertiary: 'textTertiary',
    tetxtHelpLink: 'textHelplink',
    namePrimaryAction: 'primaryAction',
    urlPrimaryAction: '/tabs/wallets',
  };

  let component: WarrantyInProgressTransactionModalComponent;
  let fixture: ComponentFixture<WarrantyInProgressTransactionModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      declarations: [WarrantyInProgressTransactionModalComponent, FakeFeatureFlagDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: TrackService, useValue: trackServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WarrantyInProgressTransactionModalComponent);
    component = fixture.componentInstance;
    component.data = testData;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track screenview event on init', () => {
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should router navigate when Close Success is clicked', () => {
    const closeButtonEl = fixture.debugElement.query(By.css("ion-button[name='Close Success']"));
    closeButtonEl.nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlClose]);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should router navigate when Success Action Primary is clicked', () => {
    const primaryButtonEl = fixture.debugElement.query(By.css("ion-button[name='Success Action Primary']"));
    primaryButtonEl.nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlPrimaryAction]);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should router navigate to whatsapp support when whatsapp is clicked', () => {
    const supportButtonEl = fixture.debugElement.query(By.css("ion-button[name='WhatsApp']"));
    supportButtonEl.nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  })
});
