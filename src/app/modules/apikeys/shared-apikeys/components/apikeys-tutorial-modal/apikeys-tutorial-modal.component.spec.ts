import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { ApikeysTutorialModalComponent } from './apikeys-tutorial-modal.component';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

describe('ApikeysTutorialModalComponent', () => {
  let component: ApikeysTutorialModalComponent;
  let fixture: ComponentFixture<ApikeysTutorialModalComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ApikeysTutorialModalComponent>;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      TestBed.configureTestingModule({
        declarations: [ApikeysTutorialModalComponent, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [TranslateModule.forRoot(), IonicModule.forRoot(), HttpClientTestingModule],
        providers: [{ provide: ModalController, useValue: modalControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(ApikeysTutorialModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dismiss and return state cancel when user clicks Close button', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement;
    buttonEl.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(null, 'cancel');
  });

  it('should dismiss and return state cancel when user clicks I Have an Account button', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="I Have an Account"]')).nativeElement;
    buttonEl.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(null, 'success');
  });

  ['Close', 'I Have an Account'].forEach((name) => {
    it(`should should call trackEvent when ${name} button is clicked`, () => {
      const el = trackClickDirectiveHelper.getByElementByName('ion-button', name);
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
