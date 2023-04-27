import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { BackupPage } from './backup.page';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TrackService } from 'src/app/shared/services/track/track.service';

describe('BackupPage', () => {
  let component: BackupPage;
  let fixture: ComponentFixture<BackupPage>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(waitForAsync(() => {
    ionicStorageServiceSpy = jasmine.createSpyObj('StorageService', {
      get: Promise.resolve(),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      declarations: [BackupPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: TrackService, useValue: trackServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BackupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly texts and toggle', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.b__title'));
    const labelEl = fixture.debugElement.query(By.css('.b__item__toggle__labels ion-text'));
    const toggle = fixture.debugElement.query(By.css('ion-toggle[name="ux_backup"]'));
    expect(titleEl.nativeElement.innerHTML).toContain('profiles.backup.title');
    expect(labelEl.nativeElement.innerHTML).toContain('profiles.backup.toggle_text');
    expect(toggle).toBeTruthy();
  });

  it('should set toggle to checked and disabled when backup_wallet is true', async() => {
    ionicStorageServiceSpy.get.and.resolveTo(true);
    component.ngOnInit()
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const toggle = fixture.debugElement.query(By.css('ion-toggle[name="ux_backup"]'));

    expect(toggle.nativeElement.disabled).toBeTruthy()
    expect(toggle.nativeElement.checked).toBeTruthy()
  })

  it('should navigate and call trackEvent when toggle is enabled and clickable', async() => {
    ionicStorageServiceSpy.get.and.resolveTo(false);
    component.ngOnInit()
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-toggle[name="ux_backup"]')).nativeElement.click();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/success-creation')
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1)
  })
});
