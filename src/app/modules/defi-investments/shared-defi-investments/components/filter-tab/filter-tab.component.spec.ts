import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FilterTabComponent } from './filter-tab.component';

describe('FilterTabComponent', () => {
  let component: FilterTabComponent;
  let fixture: ComponentFixture<FilterTabComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FilterTabComponent>;
  let controlContainerMock: UntypedFormGroup;
  let formGroupDirectiveMock: FormGroupDirective;
  let elementRefSpy: jasmine.SpyObj<ElementRef>;

  beforeEach(waitForAsync(() => {
    controlContainerMock = new UntypedFormGroup({
      testControl: new UntypedFormControl(),
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;
    elementRefSpy = jasmine.createSpyObj(
      'ElementRef',
      {},
      {
        nativeElement: {
          querySelector: () => {
            return { scrollIntoView: () => null };
          },
        },
      }
    );
    TestBed.configureTestingModule({
      declarations: [FilterTabComponent, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterTabComponent);
    component = fixture.componentInstance;
    component.controlName = 'testControl';
    component.elRef = elementRefSpy;
    component.items = [
      { title: 'testTitle', value: 'testValue', dataToTrack: 'test' },
      { title: 'testTitle', value: 'value1', dataToTrack: 'test1' },
    ];
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    fixture.detectChanges();
    const testButton = fixture.debugElement.query(By.css('.dt ion-segment-button'));
    expect(testButton).toBeTruthy();
  });

  it('should scroll to segment button when clicked', async () => {
    const spy = spyOn(component, 'scrollToElement');
    fixture.detectChanges();
    component.control.patchValue('testValue');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent when ion-segment-button is clicked', () => {
    fixture.detectChanges();
    const segment = fixture.debugElement.query(By.css('ion-segment-button'));
    const directive = trackClickDirectiveHelper.getDirective(segment);
    const spy = spyOn(directive, 'clickEvent');
    segment.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
