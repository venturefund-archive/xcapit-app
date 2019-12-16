import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundCreatedPage } from './fund-created.page';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('FundCreatedPage', () => {
  let component: FundCreatedPage;
  let fixture: ComponentFixture<FundCreatedPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundCreatedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FundCreatedPage, TrackClickDirective],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundCreatedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Go To Fund is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Go To Fund'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
