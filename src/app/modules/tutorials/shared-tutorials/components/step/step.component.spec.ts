import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { StepComponent } from './step.component';

describe('StepComponent', () => {
  let component: StepComponent;
  let fixture: ComponentFixture<StepComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<StepComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StepComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(StepComponent);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      component.title = 'testTitle';
      component.subtitle = 'testSubtitle';
      component.imagePath = 'assets/img/tutorials/onboarding/first_step.svg';
      component.sliderLength = 3;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title, subtitle and image properly', () => {
    const titleEl = fixture.debugElement.query(By.css('ion-text.step__content_slide__text__primary_text'));
    const subtitleEl = fixture.debugElement.query(By.css('ion-text.step__content_slide__text__secondary_text'));
    const imageEl = fixture.debugElement.query(By.css('.step__content_slide__image>img'));

    expect(titleEl.nativeElement.innerHTML).toContain('testTitle');
    expect(subtitleEl.nativeElement.innerHTML).toContain('testSubtitle');
    expect(imageEl.properties.src).toEqual('assets/img/tutorials/onboarding/first_step.svg');
  });

  it('should render the back button properly when the step is not the first', () => {
    component.actualStep = 2;
    fixture.detectChanges();
    const backButtonEl = fixture.debugElement.query(By.css('ion-button[name="Ion Slide Back Button"]'));

    expect(backButtonEl).toBeTruthy();
  });

  it('should not render the back button when the step is the first', () => {
    component.actualStep = 1;
    fixture.detectChanges();
    const backButtonEl = fixture.debugElement.query(By.css('ion-button[name="Ion Slide Back Button"]'));

    expect(backButtonEl).toBeFalsy();
  });

  it('should render the next button and the skip button properly and not render the finish button when the step is not the last', () => {
    component.actualStep = 2;
    fixture.detectChanges();
    const nextButtonEl = fixture.debugElement.query(By.css('ion-button[name="Ion Slide Next Button"]'));
    const skipButtonEl = fixture.debugElement.query(By.css('ion-button[name="Skip Onboarding"]'));
    const finishButtonEl = fixture.debugElement.query(By.css('ion-button[name="Finish Onboarding"]'));

    expect(nextButtonEl).toBeTruthy();
    expect(skipButtonEl).toBeTruthy();
    expect(finishButtonEl).toBeFalsy();
  });

  it('should render the finish button properly when the step is the last', () => {
    component.actualStep = component.sliderLength;
    fixture.detectChanges();
    const finishButtonEl = fixture.debugElement.query(By.css('ion-button[name="Finish Onboarding"]'));

    expect(finishButtonEl).toBeTruthy();
  });

  [
    { button: 'Skip Onboarding', step: 1 },
    { button: 'Finish Onboarding', step: 3 },
    { button: 'Ion Slide Next Button', step: 1 },
    { button: 'Ion Slide Back Button', step: 2 },
  ].forEach((item) => {
    it(`should call trackEvent on trackService when ${item.button} button is clicked`, () => {
      component.actualStep = item.step;
      fixture.detectChanges();
      const el = trackClickDirectiveHelper.getByElementByName('ion-button', item.button);
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('should emit the slideNextEvent when Ion Slide Next Button is clicked', () => {
    component.actualStep = 1;
    fixture.detectChanges();
    const spy = spyOn(component.slideNextEvent, 'emit');
    fixture.debugElement.query(By.css('ion-button[name="Ion Slide Next Button"]')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should emit the slideBackEvent when Ion Slide Back Button is clicked', () => {
    component.actualStep = 2;
    fixture.detectChanges();
    const spy = spyOn(component.slideBackEvent, 'emit');
    fixture.debugElement.query(By.css('ion-button[name="Ion Slide Back Button"]')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should emit the finishEvent when Finish Onboarding is clicked', () => {
    component.actualStep = 3;
    fixture.detectChanges();
    const spy = spyOn(component.finishEvent, 'emit');
    fixture.debugElement.query(By.css('ion-button[name="Finish Onboarding"]')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should emit the finishEvent when Skip Onboarding is clicked', () => {
    component.actualStep = 2;
    fixture.detectChanges();
    const spy = spyOn(component.finishEvent, 'emit');
    fixture.debugElement.query(By.css('ion-button[name="Skip Onboarding"]')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
