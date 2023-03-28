import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessContentComponent } from './success-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { By } from '@angular/platform-browser';
import { ModalController, NavController } from '@ionic/angular';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { TrackService } from '../../services/track/track.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

describe('SuccessContentComponent', () => {
  let component: SuccessContentComponent;
  let fixture: ComponentFixture<SuccessContentComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessContentComponent>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let closeSuccessButton: any;
  let actionPrimaryButton: any;
  let actionSecondaryButton: any;
  let actionThirdButton: any;
  
  const testData = {
    urlClose: '/tabs/investments/binance',
    textPrimary: 'test.test.textPrimary',
    textSecondary: 'test.test.textSecondary',
    textThird: 'test.test.textThird',
    urlPrimaryAction: '/apikeys/new',
    namePrimaryAction: 'test.test.namePrimaryAction',
    urlSecondaryAction: '/tabs/investments/binance',
    nameSecondaryAction: 'test.test.nameSecondaryAction',
    urlThirdAction: '/tabs/investments/binance',
    nameThirdAction: 'test.test.nameThirdAction',
    disclaimer: 'test.test.disclaimer',
    image: 'assets/img/defi-investments/success-withdraw.svg',
    bottomImage: true,
    hasToTrackScreenview: true,
    screenviewEventLabel: 'example',
  };
  let testDataSpy: jasmine.SpyObj<any>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      testDataSpy = jasmine.createSpyObj('TestData', {}, testData);
      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy',{
        trackEvent: Promise.resolve(true),
      })
      fakeModalController = new FakeModalController(null, { role: 'confirm' });
      modalControllerSpy = fakeModalController.createSpy();
      TestBed.configureTestingModule({
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
        declarations: [SuccessContentComponent, FakeTrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessContentComponent);
      component = fixture.componentInstance;
      component.data = testDataSpy;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track screenview event on init', () => {
    component.ngOnInit();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalled();
  });

  describe('Buttons should call trackEvent on TrackService when they are clicked', () => {
    it('should call trackEvent on trackService when Close Success is clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close Success');
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spyClickEvent = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when Success Action Primary is clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Success Action Primary');
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spyClickEvent = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when Success Action Secondary is clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Success Action Secondary');
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spyClickEvent = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when Success Action Third is clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Success Action Third');
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spyClickEvent = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('', () => {
    beforeEach(() => {
      closeSuccessButton = fixture.debugElement.query(By.css("ion-button[name='Close Success']"));
      actionPrimaryButton = fixture.debugElement.query(By.css("ion-button[name='Success Action Primary']"));
      actionSecondaryButton = fixture.debugElement.query(By.css("ion-button[name='Success Action Secondary']"));
      actionThirdButton = fixture.debugElement.query(By.css("ion-button[name='Success Action Third']"));
    });

    it('should router navigate when Close Success is clicked', () => {
      closeSuccessButton.nativeElement.click();
      expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith([component.data.urlClose], { animationDirection: 'forward' });
    });

    it('should router navigate when Success Action Primary is clicked', () => {
      actionPrimaryButton.nativeElement.click();
      expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith([component.data.urlPrimaryAction]);
    });

    it('should router navigate when Success Action Secondary is clicked', () => {
      actionSecondaryButton.nativeElement.click();
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlSecondaryAction]);
    });

    it('should router navigate when Success Action Third is clicked', () => {
      actionThirdButton.nativeElement.click();
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlThirdAction]);
    });

    it('should emit event when Success Action Primary is clicked', () => {
      const spy = spyOn(component.primaryActionEvent, 'emit');
      actionPrimaryButton.nativeElement.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit event when Success Action Secondary is clicked', () => {
      const spy = spyOn(component.secondaryActionEvent, 'emit');
      actionSecondaryButton.nativeElement.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit event when Success Action Third is clicked', () => {
      const spy = spyOn(component.secondaryActionEvent, 'emit');
      actionThirdButton.nativeElement.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should dismiss when called as modal and Success Action Primary is clicked', () => {
      component.calledAsModal = true;
      closeSuccessButton.nativeElement.click();
      expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1)
    })
  
    it('should dismiss when called as modal and Close Success is clicked', () => {
      component.calledAsModal = true;
      actionPrimaryButton.nativeElement.click();
      expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1)
    })
  });

  it('should render bottom image when bottomImage attribute is true', () => {
    const imageEl = fixture.debugElement.query(By.css('.main__ux-success-image'));
    expect(imageEl).toBeTruthy();
  });
});
