import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { SuccessContentComponent } from './success-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';

describe('SuccessContentComponent', () => {
  let component: SuccessContentComponent;
  let fixture: ComponentFixture<SuccessContentComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessContentComponent>;
  const testData = {
    urlClose: '/tabs/funds',
    textPrimary: 'test.test.textPrimary',
    textSecondary: 'test.test.textSecondary',
    textThird: 'test.test.textThird',
    urlPrimaryAction: '/apikeys/new',
    namePrimaryAction: 'test.test.namePrimaryAction',
    urlSecondaryAction: '/tabs/funds',
    nameSecondaryAction: 'test.test.nameSecondaryAction',
    urlThirdAction: '/tabs/funds',
    nameThirdAction: 'test.test.nameThirdAction',
  };
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SuccessContentComponent, TrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([
            { path: 'tabs/funds', component: DummyComponent },
            { path: 'apikeys/new', component: DummyComponent },
          ]),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessContentComponent);
    component = fixture.componentInstance;
    component.data = testData;
    fixture.detectChanges();

    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Close Success is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close Success');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Success Action Primary is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Success Action Primary');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Success Action Secondary is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Success Action Secondary');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Success Action Third is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Success Action Third');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
