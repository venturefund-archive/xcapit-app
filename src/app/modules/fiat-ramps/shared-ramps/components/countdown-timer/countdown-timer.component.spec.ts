import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { CountdownTimerService } from '../../services/countdown-timer/countdown-timer.service';

import { CountdownTimerComponent } from './countdown-timer.component';

describe('CountdownTimerComponent', () => {
  let component: CountdownTimerComponent;
  let fixture: ComponentFixture<CountdownTimerComponent>;
  let countdownTimerServiceSpy: jasmine.SpyObj<CountdownTimerService>;

  beforeEach(waitForAsync(() => {
    countdownTimerServiceSpy = jasmine.createSpyObj('CountdownTimerComponent', {
      getCurrentTime: 120,
      startTimerSubscription: of({}),
    });
    TestBed.configureTestingModule({
      declarations: [CountdownTimerComponent],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: CountdownTimerService, useValue: countdownTimerServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CountdownTimerComponent);
    component = fixture.componentInstance;
    component.timerSeconds = 120;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not start a new timer if it is already running', () => {
    countdownTimerServiceSpy.getCurrentTime.and.returnValue(120);
    fixture.detectChanges();
    fixture.whenStable();

    expect(countdownTimerServiceSpy.startTimerSubscription).toHaveBeenCalledTimes(1);
    expect(component.serviceTimer).toEqual(120);
  });

  it('should start a new timer if it is not already running', () => {
    countdownTimerServiceSpy.getCurrentTime.and.resolveTo();

    expect(countdownTimerServiceSpy.startTimerSubscription).toHaveBeenCalledTimes(1);
  });

  it('should emit an event when it finishes counting', () => {
    const finishCountSpy = spyOn(component.hasFinishedCounting, 'emit');
    countdownTimerServiceSpy.getCurrentTime.and.returnValue(0);
    component.ngOnInit();
    fixture.detectChanges();

    expect(finishCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe on leave', () => {
    const destroySpy = spyOn(component.subscriptionTimer$, 'unsubscribe');
    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalledTimes(1);
  });
});
