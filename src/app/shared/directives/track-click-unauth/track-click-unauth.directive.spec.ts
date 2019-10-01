import { TrackClickUnauthDirective } from './track-click-unauth.directive';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TrackService } from '../../services/track/track.service';
import { Component, DebugElement, ElementRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <div>
      <button
        appTrackClickUnauth
        [dataToTrack]="{ eventLabel: 'Copy Deposit Address' }"
        type="button"
      >
        Button
      </button>
      <button
        appTrackClickUnauth
        name="button2"
        type="button"
      >
        Button
      </button>
    </div>
  `
})
class TestComponent {}

describe('TrackClickUnauthDirective', () => {
  let trackServiceSpy: any;
  let directive: TrackClickUnauthDirective;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  let elementRefMock: any;

  beforeEach(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackService', ['trackEvent']);
    elementRefMock = { nativeElement: { getAttribute: (name: string) => 'test' } };
    const testBed = TestBed.configureTestingModule({
      declarations: [TestComponent, TrackClickUnauthDirective],
      imports: [HttpClientTestingModule],
      providers: [
        TrackClickUnauthDirective,
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: ElementRef, useValue: elementRefMock }
      ]
    });

    directive = testBed.get(TrackClickUnauthDirective);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('button'));
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should call trackEvent on clickEvent', () => {
    directive.clickEvent('click');
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when button clicked', () => {
    directive = fixture.debugElement
      .query(By.directive(TrackClickUnauthDirective))
      .injector.get(TrackClickUnauthDirective) as TrackClickUnauthDirective;
    const spy = spyOn(directive, 'clickEvent');
    inputEl.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when button clicked & has a name', () => {
    const el = fixture.debugElement.query(By.css('button[name="button2"]'));
    directive = el.injector.get(TrackClickUnauthDirective) as TrackClickUnauthDirective;
    const spy = spyOn(directive, 'clickEvent');
    el.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
