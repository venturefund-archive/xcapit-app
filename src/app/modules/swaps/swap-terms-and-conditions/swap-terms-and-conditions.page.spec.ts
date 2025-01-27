import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { SwapTermsAndConditionsPage } from './swap-terms-and-conditions.page';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { DefaultSwapsUrls } from '../shared-swaps/routes/default-swaps-urls';

describe('SwapTermsAndConditionsPage', () => {
  let component: SwapTermsAndConditionsPage;
  let fixture: ComponentFixture<SwapTermsAndConditionsPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;


  beforeEach(waitForAsync(() => {
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
    });

    fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
      declarations: [ SwapTermsAndConditionsPage, FakeTrackClickDirective ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SwapTermsAndConditionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set acceptTos with value passed to onToggleCheckbox', () => {
    component.onToggleCheckbox(true);

    expect(component.acceptTos).toBeTrue();
  });

  it('should navigate when acceptTos is true & button is clicked', async () => {
    component.acceptTos = true;

    fixture.debugElement.query(By.css('ion-button[name="ux_swap_terms_and_conditions"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(ionicStorageServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(new DefaultSwapsUrls().home(), { replaceUrl: true });
  });

  it('should navigate to back when Close Success button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Close Success"]')).nativeElement.click();

    fixture.detectChanges();

    expect(navControllerSpy.back).toHaveBeenCalledTimes(1);
  });

  it('should activated button when checkbox is checked', async () => {
    component.acceptTos = true;
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css("ion-button[name='ux_swap_terms_and_conditions']"));

    expect(buttonEl.attributes['ng-reflect-disabled']).toBe('false');
  });

  it('should disabled button when checkbox is not checked', () => {
    const buttonEl = fixture.debugElement.query(By.css("ion-button[name='ux_swap_terms_and_conditions']"));

    expect(buttonEl.attributes['ng-reflect-disabled']).toBe('true');
  });
});
