import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UrlSerializer } from '@angular/router';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { SwapInProgressModalComponent } from './swap-in-progress-modal.component';

const testData = {
  image: 'assets/img/swaps/swap-in-progress.svg',
  icon: 'assets/img/swaps/swap-icon.svg',
  urlClose: '/tabs/wallets',
  textPrimary: 'swaps.swap_in_progress.textPrimary',
  textSecondary: 'swaps.swap_in_progress.textSecondary',
  namePrimaryAction: 'swaps.swap_in_progress.buttonText',
  urlPrimaryAction: '/tabs/wallets',
  titlePrimary: 'Intercambio',
  textBadge: 'En progreso',
};

describe('SwapInProgressModalComponent', () => {
  let component: SwapInProgressModalComponent;
  let fixture: ComponentFixture<SwapInProgressModalComponent>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(waitForAsync(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [SwapInProgressModalComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        UrlSerializer,
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SwapInProgressModalComponent);
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
});
