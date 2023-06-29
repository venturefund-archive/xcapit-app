import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { KriptonStorageService } from '../../services/kripton-storage/kripton-storage.service';
import { KYCStatusCardComponent } from './kyc-status-card.component';

describe('KYCStatusCardComponent', () => {
  let component: KYCStatusCardComponent;
  let fixture: ComponentFixture<KYCStatusCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let kriptonStorageSpy: jasmine.SpyObj<KriptonStorageService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    kriptonStorageSpy = jasmine.createSpyObj('KriptonStorageService', {
      set: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [KYCStatusCardComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: KriptonStorageService, useValue: kriptonStorageSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KYCStatusCardComponent);
    component = fixture.componentInstance;
    component.title = 'testTitle';
    component.statusText = 'testStatus';
    component.message = 'testMessage';
    component.kycApproved = true;
    component.disabledCard = true;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    component.disabledCard = false;
    component.kycApproved = false;
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const titleEl = fixture.debugElement.query(By.css('div.ksc__title > ion-text.title'));
    const statusEl = fixture.debugElement.query(By.css('div.ksc__title > ion-text.status'));
    const iconEl = fixture.debugElement.query(By.css('div.ksc__title > ion-icon'));
    const messageEl = fixture.debugElement.query(By.css('div.ksc__message > ion-text'));
    expect(titleEl.nativeElement.innerHTML).toContain('testTitle');
    expect(statusEl.nativeElement.innerHTML).toContain('testStatus');
    expect(iconEl).toBeFalsy();
    expect(messageEl.nativeElement.innerHTML).toContain('testMessage');
  });

  it('should render close icon and not render status when kys is approve', async () => {
    component.disabledCard = false;
    component.kycApproved = true;
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const statusEl = fixture.debugElement.query(By.css('div.ksc__title > ion-text.status'));
    const iconEl = fixture.debugElement.query(By.css('div.ksc__title > ion-icon'));
    expect(iconEl).toBeTruthy();
    expect(statusEl).toBeFalsy();
  });

  it('should disabled card and set on storage when kyc is approve and close icon is clicked', async () => {
    component.disabledCard = false;
    component.kycApproved = true;
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.debugElement.query(By.css('div.ksc__title > ion-icon')).nativeElement.click();
    expect(component.disabledCard).toBeTrue();
    expect(kriptonStorageSpy.set).toHaveBeenCalledTimes(1);
  });

  it('should redirect to user register page when card is clicked and user status is user_information or user_images', async () => {
    component.disabledCard = false;
    component.kycApproved = true;
    component.userStatus = 'USER_INFORMATION';
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.debugElement.query(By.css('div.ksc')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/fiat-ramps/user-basic');
  });

  it('should disabled card if disabledcard var is true', async () => {
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const cardEl = fixture.debugElement.query(By.css('div.ksc'));
    expect(component.disabledCard).toBeTrue();
    expect(cardEl).toBeFalsy();
  });
});
