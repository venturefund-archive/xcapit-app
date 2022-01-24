import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguagePopoverComponent } from './language-popover.component';
import { LanguageService } from '../../services/language/language.service';
import { PopoverController } from '@ionic/angular';
import { LogsService } from '../../services/logs/logs.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

describe('LanguagePopoverComponent', () => {
  let component: LanguagePopoverComponent;
  let fixture: ComponentFixture<LanguagePopoverComponent>;
  let languageServiceSpy: any;
  let popoverControllerSpy: any;
  let logsServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<LanguagePopoverComponent>;
  beforeEach(
    waitForAsync(() => {
      logsServiceMock = {
        log: () => of({}),
      };
      languageServiceSpy = jasmine.createSpyObj('LanguageService', ['getLanguages', 'setLanguage']);
      languageServiceSpy.getLanguages.and.returnValue([
        { value: 'es', text: 'Español' },
        { value: 'en', text: 'English' },
      ]);
      popoverControllerSpy = jasmine.createSpyObj('PopoverController', ['dismiss']);

      TestBed.configureTestingModule({
        declarations: [LanguagePopoverComponent, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [HttpClientTestingModule],
        providers: [
          { provide: LogsService, useValue: logsServiceMock },
          { provide: LanguageService, useValue: languageServiceSpy },
          { provide: PopoverController, useValue: popoverControllerSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagePopoverComponent);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
    popoverControllerSpy = TestBed.inject(PopoverController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be call dismiss on popoverController when call select', () => {
    component.select('');
    expect(popoverControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when elements with the directive are clicked', () => {
    fixture.detectChanges();
    const elms = trackClickDirectiveHelper.getAllElementsWithTheDirective();
    for (const el of elms) {
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    }
    expect(elms.length).toBe(2);
  });
});
