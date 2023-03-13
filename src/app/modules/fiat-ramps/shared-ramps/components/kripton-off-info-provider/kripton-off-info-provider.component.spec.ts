import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { KriptonOffInfoProviderComponent } from './kripton-off-info-provider.component';

describe('KriptonOffInfoProviderComponent', () => {
  let component: KriptonOffInfoProviderComponent;
  let fixture: ComponentFixture<KriptonOffInfoProviderComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<KriptonOffInfoProviderComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      declarations: [ KriptonOffInfoProviderComponent, FakeTrackClickDirective ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: 
      [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KriptonOffInfoProviderComponent);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Close clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close informative modal when Close clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should open Kripton Market main page when Go To Kripton link is clicked', () => {
    fixture.debugElement.query(By.css('ion-text[name="Go To Kripton"]')).nativeElement.click();
    fixture.detectChanges();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://kriptonmarket.com' });
  })
});
