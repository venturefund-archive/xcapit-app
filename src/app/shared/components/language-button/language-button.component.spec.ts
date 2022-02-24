import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageButtonComponent } from './language-button.component';
import { PopoverController } from '@ionic/angular';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

describe('LanguageButtonComponent', () => {
  let component: LanguageButtonComponent;
  let fixture: ComponentFixture<LanguageButtonComponent>;
  let popoverControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<LanguageButtonComponent>;
  beforeEach(
    waitForAsync(() => {
      popoverControllerSpy = jasmine.createSpyObj('PopoverController', ['create']);
      popoverControllerSpy.create.and.returnValue(
        of({
          present: () => {},
          onWillDismiss: () => of({}).toPromise(),
        }).toPromise()
      );

      TestBed.configureTestingModule({
        declarations: [LanguageButtonComponent, FakeTrackClickDirective],
        imports: [HttpClientTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [{ provide: PopoverController, useValue: popoverControllerSpy }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageButtonComponent);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    popoverControllerSpy = TestBed.inject(PopoverController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be call create on popoverController when call openLanguagePopover', () => {
    component.openLanguagePopover(null);
    expect(popoverControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Open Language Popover button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Open Language Popover');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
