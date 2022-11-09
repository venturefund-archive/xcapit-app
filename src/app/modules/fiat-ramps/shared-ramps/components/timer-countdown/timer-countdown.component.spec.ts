import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { TimerCountdownComponent } from './timer-countdown.component';

describe('TimerCountdownComponent', () => {
  let component: TimerCountdownComponent;
  let fixture: ComponentFixture<TimerCountdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerCountdownComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerCountdownComponent);
    component = fixture.componentInstance;
  }));

  it('should create',fakeAsync(() => {
    fixture.detectChanges();
    tick(1001);
    expect(component).toBeTruthy();
    discardPeriodicTasks();
  }));

  
  it('should render timer',fakeAsync(() => {
    fixture.detectChanges();
    tick(1001);
    const timerEl = fixture.debugElement.query(By.css('.tc'));
    expect(timerEl).toBeTruthy();
   
    discardPeriodicTasks();
  }));
});
