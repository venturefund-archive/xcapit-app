import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxInputComponent } from './ux-input.component';
import { FormGroupDirective } from '@angular/forms';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ClipboardService } from '../../services/clipboard/clipboard.service';
import { ToastService } from '../../services/toast/toast.service';
import { By } from '@angular/platform-browser';

describe('UxInputComponent', () => {
  let component: UxInputComponent;
  let fixture: ComponentFixture<UxInputComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UxInputComponent>;
  let clipboardServiceSpy: any;
  let toastServiceSpy: any;
  let formGroupDirectiveSpy: any;
  beforeEach(
    waitForAsync(() => {
      toastServiceSpy = jasmine.createSpyObj('ToastService', { showToast: Promise.resolve() });
      clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', { write: Promise.resolve() });
      formGroupDirectiveSpy = jasmine.createSpyObj(
        'FormGroupDirective',
        {},
        { control: { get: () => ({ value: 'test' }) } }
      );
      TestBed.configureTestingModule({
        declarations: [UxInputComponent, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: FormGroupDirective, useValue: formGroupDirectiveSpy },
          { provide: ClipboardService, useValue: clipboardServiceSpy },
          { provide: ToastService, useValue: toastServiceSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UxInputComponent);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call write in ClipboardService when call copyToClipboard', async () => {
    clipboardServiceSpy.write.and.returnValue(of({}).toPromise());
    component.copyToClipboard();
    expect(clipboardServiceSpy.write).toHaveBeenCalledTimes(1);
  });

  it('should call write with dataInput when copyToClipboard is called', async () => {
    const expectedArg = { url: 'test' };
    fixture.detectChanges();
    component.copyToClipboard();
    fixture.whenStable().then(() => {
      expect(clipboardServiceSpy.write).toHaveBeenCalledWith(expectedArg);
    });
  });

  it('should call showToast when copyToClipboard is called', async () => {
    fixture.detectChanges();
    component.copyToClipboard();
    await fixture.whenStable();
    expect(toastServiceSpy.showToast).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Copy button is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Copy');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
