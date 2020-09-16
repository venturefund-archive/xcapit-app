import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguagePopoverComponent } from './language-popover.component';
import { LanguageService } from '../../services/language/language.service';
import { PopoverController } from '@ionic/angular';
import { LogsService } from '../../services/logs/logs.service';
import { of } from 'rxjs';
import { TrackClickUnauthDirectiveTestHelper } from 'src/testing/track-click-unauth-directive-test.helper';
import { TrackClickUnauthDirective } from '../../directives/track-click-unauth/track-click-unauth.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LanguagePopoverComponent', () => {
  let component: LanguagePopoverComponent;
  let fixture: ComponentFixture<LanguagePopoverComponent>;
  let languageServiceSpy: any;
  let popoverControllerSpy: any;
  let logsServiceMock: any;
  let trackClickUnauthDirectiveHelper: TrackClickUnauthDirectiveTestHelper<
    LanguagePopoverComponent
  >;
  beforeEach(async(() => {
    logsServiceMock = {
      log: () => of({})
    };
    languageServiceSpy = jasmine.createSpyObj('LanguageService', [
      'getLanguages',
      'setLanguage'
    ]);
    languageServiceSpy.getLanguages.and.returnValue([
      { value: 'es', text: 'Español' },
      { value: 'en', text: 'English' }
    ]);
    popoverControllerSpy = jasmine.createSpyObj('PopoverController', [
      'dismiss'
    ]);

    TestBed.configureTestingModule({
      declarations: [LanguagePopoverComponent, TrackClickUnauthDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule],
      providers: [
        TrackClickUnauthDirective,
        { provide: LogsService, useValue: logsServiceMock },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: PopoverController, useValue: popoverControllerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagePopoverComponent);
    component = fixture.componentInstance;
    trackClickUnauthDirectiveHelper = new TrackClickUnauthDirectiveTestHelper(
      fixture
    );
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
    const elms = trackClickUnauthDirectiveHelper.getAllElementsWithTheDirective();
    for (const el of elms) {
      const directive = trackClickUnauthDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    }
    expect(elms.length).toBe(2);
  });
});
