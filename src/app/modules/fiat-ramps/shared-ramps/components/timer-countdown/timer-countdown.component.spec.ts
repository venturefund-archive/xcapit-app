import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TimerCountdownComponent } from './timer-countdown.component';
import { Observable, Subject } from 'rxjs';
import { addHours, addMinutes } from 'date-fns';

describe('TimerCountdownComponent', () => {
  let component: TimerCountdownComponent;
  let fixture: ComponentFixture<TimerCountdownComponent>;
  let fakeTimer: Subject<number>;
  let timerSpy: jasmine.SpyObj<any>;

  beforeEach(waitForAsync(() => {
    fakeTimer = new Subject<number>();

    TestBed.configureTestingModule({
      declarations: [TimerCountdownComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimerCountdownComponent);
    component = fixture.componentInstance;
    component.timeString = undefined;
    component.deadlineDate = addHours(new Date(), 72);
    component.text = 'test';

    timerSpy = spyOn(component, 'timer').and.returnValue(fakeTimer);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render timer', () => {
    fakeTimer.next();
    fixture.detectChanges();
    const timerEl = fixture.debugElement.query(By.css('.tc'));
    expect(timerEl).toBeTruthy();
    component.unsubscribe();
  });

  it('should render loading spinner', () => {
    const spinner = fixture.debugElement.query(By.css('ion-spinner'));
    expect(spinner).toBeTruthy();
    component.unsubscribe();
  });

  it('should return observable', () => {
    timerSpy.and.callThrough();
    expect(component.timer()).toBeInstanceOf(Observable);
  });

  it('should show time without minutes and seconds', () => {
    component.deadlineDate = addHours(new Date(), 2);
    component.showMinutes = false;
    component.showSeconds = false;
    fakeTimer.next();

    expect(component.timeString.value).toMatch(/\d\d/);
  });

  it('should show time only with minutes and seconds', () => {
    component.deadlineDate = addMinutes(new Date(), 2);
    component.showHours = false;
    fakeTimer.next();

    expect(component.timeString.value).toMatch(/\d\d:\d\d/);
  });
});