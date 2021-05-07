import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { MethodComponent } from './method.component';

describe('MethodComponent', () => {
  let component: MethodComponent;
  let fixture: ComponentFixture<MethodComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<MethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodComponent, TrackClickDirective ],
      imports: [IonicModule.forRoot()],
      providers: [TrackClickDirective, HttpClient, HttpHandler],
    }).compileComponents();

    fixture = TestBed.createComponent(MethodComponent);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when openLink is called', () => {
    spyOn(window, 'open');
    component.openLink();
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when method is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'method'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
