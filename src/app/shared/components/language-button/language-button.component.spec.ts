import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageButtonComponent } from './language-button.component';
import { PopoverController } from '@ionic/angular';
import { of } from 'rxjs';
import { TrackClickUnauthDirectiveTestHelper } from 'src/testing/track-click-unauth-directive-test.helper';
import { TrackClickUnauthDirective } from '../../directives/track-click-unauth/track-click-unauth.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LanguageButtonComponent', () => {
  let component: LanguageButtonComponent;
  let fixture: ComponentFixture<LanguageButtonComponent>;
  let popoverControllerSpy: any;
  let trackClickUnauthDirectiveHelper: TrackClickUnauthDirectiveTestHelper<
    LanguageButtonComponent
  >;
  beforeEach(async(() => {
    popoverControllerSpy = jasmine.createSpyObj('PopoverController', [
      'create'
    ]);
    popoverControllerSpy.create.and.returnValue(
      of({
        present: () => {},
        onWillDismiss: () => of({}).toPromise()
      }).toPromise()
    );

    TestBed.configureTestingModule({
      declarations: [
        LanguageButtonComponent,
        TrackClickUnauthDirective
      ],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        TrackClickUnauthDirective,
        { provide: PopoverController, useValue: popoverControllerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageButtonComponent);
    component = fixture.componentInstance;
    trackClickUnauthDirectiveHelper = new TrackClickUnauthDirectiveTestHelper(
      fixture
    );
    popoverControllerSpy = TestBed.get(PopoverController);
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
    const el = trackClickUnauthDirectiveHelper.getByElementByName(
      'ion-button',
      'Open Language Popover'
    );
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
