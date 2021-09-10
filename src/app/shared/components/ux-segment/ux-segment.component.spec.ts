import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UxSegmentComponent } from './ux-segment.component';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.helper';
import { TrackClickDirective } from '../../directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const fakeData = ['OneSegment', 'TwoSegment'];

describe('UxSegmentComponent', () => {
  let component: UxSegmentComponent;
  let fixture: ComponentFixture<UxSegmentComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UxSegmentComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UxSegmentComponent, TrackClickDirective],
      imports: [IonicModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UxSegmentComponent);
    component = fixture.componentInstance;
    component.data = fakeData;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select first on init', () => {
    expect(component.selected).toBe('OneSegment');
  });

  it('should render segment buttons', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const buttons = fixture.debugElement.queryAll(By.css('ion-button'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.innerHTML).toContain('OneSegment');
    expect(buttons[1].nativeElement.innerHTML).toContain('TwoSegment');
  });

  it('should emit event and save selected on click', () => {
    const spy = spyOn(component.clickEvent, 'emit');
    const button = fixture.debugElement.query(By.css('ion-button'));
    button.nativeElement.click();
    fixture.detectChanges();
    expect(component.selected).toBe('OneSegment');
    expect(spy).toHaveBeenCalledWith('OneSegment');
  });

  it('should call trackEvent on trackService when Select Segment clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Select Segment');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
