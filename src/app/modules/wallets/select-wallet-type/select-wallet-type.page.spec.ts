import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { SelectWalletTypePage } from './select-wallet-type.page';
import { By } from '@angular/platform-browser';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { FakeFeatureFlagDirective } from '../../../../testing/fakes/feature-flag-directive.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SelectWalletTypePage', () => {
  let component: SelectWalletTypePage;
  let fixture: ComponentFixture<SelectWalletTypePage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    TestBed.configureTestingModule({
      declarations: [SelectWalletTypePage, FakeFeatureFlagDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: NavController, useValue: navControllerSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectWalletTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to on-boarding when Close button is clicked', () => {
    component.ionViewWillEnter();
    fixture.debugElement.query(By.css('ion-button[name="Close button"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/users/on-boarding');
  });
});
