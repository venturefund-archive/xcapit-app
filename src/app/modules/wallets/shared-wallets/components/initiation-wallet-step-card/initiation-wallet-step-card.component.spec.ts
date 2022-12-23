import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { InitiationWalletStepCardComponent } from './initiation-wallet-step-card.component';

describe('InitiationWalletStepCardComponent', () => {
  let component: InitiationWalletStepCardComponent;
  let fixture: ComponentFixture<InitiationWalletStepCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InitiationWalletStepCardComponent>;

  const nextStep = {
    icon: 'ux-arrow-narrow-down-backgroun',
    title: 'wallets.experimental_onboarding.steps.step_two.title',
    subtitle: 'wallets.experimental_onboarding.steps.step_two.subtitle',
    url: '/wallets/receive/detail?asset=USDC&network=MATIC',
    name: 'ux_exp_deposit',
    isComplete: false,
  };

  const stepCompleted = {
    icon: 'checkmark-circle-backgroun',
    title: 'wallets.experimental_onboarding.steps.step_three.title',
    isComplete: true,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InitiationWalletStepCardComponent, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(InitiationWalletStepCardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly when is nextStep', () => {
    component.nextStep = nextStep;
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('div.iwsc__wrapper__step ion-icon'));

    const titleEl = fixture.debugElement.query(By.css('div.iwsc__wrapper__content ion-text'));
    const subtitleEl = fixture.debugElement.query(By.css('div.subtitle ion-text'));
    expect(titleEl.nativeElement.innerHTML).toContain(nextStep.title);
    expect(subtitleEl.nativeElement.innerHTML).toContain(nextStep.subtitle);
    expect(iconEl.attributes['ng-reflect-name']).toContain(nextStep.icon);
  });

  it('should render properly when is completedStep ', () => {
    component.stepCompleted = stepCompleted;
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('div.iwsc__wrapper__step ion-icon'));

    const titleEl = fixture.debugElement.query(By.css('div.iwsc__wrapper__content ion-text'));
    const completed = fixture.debugElement.query(By.css('div.iwsc__wrapper__action ion-text'));
    expect(titleEl.nativeElement.innerHTML).toContain(stepCompleted.title);
    expect(completed.nativeElement.innerHTML).toContain('wallets.experimental_onboarding.completed');
    expect(iconEl.attributes['ng-reflect-name']).toContain(stepCompleted.icon);
  });

  it('should emit event when item is clicked', () => {
    const itemEl = fixture.debugElement.query(By.css('ion-item.iwsc'));
    const spy = spyOn(component.navigate, 'emit');
    itemEl.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent if item was clicked', () => {
    component.ngOnInit();
    const el = trackClickDirectiveHelper.getElement('ion-item');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
