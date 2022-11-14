import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { TimerCountdownComponent } from './timer-countdown.component';

fdescribe('TimerCountdownComponent', () => {
  let component: TimerCountdownComponent;
  let fixture: ComponentFixture<TimerCountdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimerCountdownComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimerCountdownComponent);
    component = fixture.componentInstance;
    component.timeString = { value: '23:59' };
  }));
  
  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  
  it('should render timer', fakeAsync(() => {
    fixture.detectChanges();
    tick(1001);
    discardPeriodicTasks();
    const timerEl = fixture.debugElement.query(By.css('.tc'));
    expect(timerEl).toBeTruthy();
  }));
  
  it('should render loading spinner', fakeAsync(() => {
    component.timeString = null;
    fixture.detectChanges();
    discardPeriodicTasks();
    const spinner = fixture.debugElement.query(By.css('ion-spinner'));
    expect(spinner).toBeTruthy();
  }));
});
