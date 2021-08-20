import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { SuccessContentComponent } from './success-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { By } from '@angular/platform-browser';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { NavController } from '@ionic/angular';

describe('SuccessContentComponent', () => {
  let component: SuccessContentComponent;
  let fixture: ComponentFixture<SuccessContentComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessContentComponent>;
  let navControllerSpy: any;
  let closeSuccessButton: any;
  let actionPrimaryButton: any;
  let actionSecondaryButton: any;
  let actionThirdButton: any;

  const testData = {
    urlClose: '/tabs/funds',
    textPrimary: 'test.test.textPrimary',
    textSecondary: 'test.test.textSecondary',
    textThird: 'test.test.textThird',
    urlPrimaryAction: '/apikeys/new',
    namePrimaryAction: 'test.test.namePrimaryAction',
    urlSecondaryAction: '/tabs/funds',
    nameSecondaryAction: 'test.test.nameSecondaryAction',
    urlThirdAction: '/tabs/funds',
    nameThirdAction: 'test.test.nameThirdAction',
  };
  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        declarations: [SuccessContentComponent, TrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessContentComponent);
      component = fixture.componentInstance;
      component.data = testData;
      fixture.detectChanges();

      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
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
      closeSuccessButton.triggerEventHandler('click', null);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlClose]);
    });

    it('should router navigate when Success Action Primary is clicked', () => {
      actionPrimaryButton.triggerEventHandler('click', null);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlPrimaryAction]);
    });

    it('should router navigate when Success Action Secondary is clicked', () => {
      actionSecondaryButton.triggerEventHandler('click', null);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlSecondaryAction]);
    });

    it('should router navigate when Success Action Third is clicked', () => {
      actionThirdButton.triggerEventHandler('click', null);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.data.urlThirdAction]);
    });

    it('should emit event when Success Action Primary is clicked', () => {
      const spy = spyOn(component.primaryActionEvent, 'emit');
      actionPrimaryButton.triggerEventHandler('click', null);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit event when Success Action Secondary is clicked', () => {
      const spy = spyOn(component.secondaryActionEvent, 'emit');
      actionSecondaryButton.triggerEventHandler('click', null);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit event when Success Action Third is clicked', () => {
      const spy = spyOn(component.secondaryActionEvent, 'emit');
      actionThirdButton.triggerEventHandler('click', null);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
