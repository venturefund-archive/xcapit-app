import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialApikeysPage } from './tutorial-apikeys.page';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';


describe('TutorialApikeysPage', () => {
  let component: TutorialApikeysPage;
  let fixture: ComponentFixture<TutorialApikeysPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<TutorialApikeysPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TutorialApikeysPage, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'apikeys/insert-key', component: DummyComponent },
          { path: 'tutorials/help', component: DummyComponent }
        ]),
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [TrackClickDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialApikeysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Next Button clicked', () => {
    spyOn(window, 'open');
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Next'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call window.open when moreInfo is called', () => {
    spyOn(window, 'open');
    component.moreInfo();
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go To Help link clicked', () => {
    spyOn(window, 'open');
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Go To Help'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
