import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { ItemInputCopyComponent } from './item-input-copy.component';

describe('ItemInputCopyComponent', () => {
  let component: ItemInputCopyComponent;
  let fixture: ComponentFixture<ItemInputCopyComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ItemInputCopyComponent>;
  let clipboardServiceSpy: any;
  let toastServiceSpy: any;

  beforeEach(
    waitForAsync(() => {
      toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
      clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', ['write']);
      clipboardServiceSpy.write.and.returnValue(Promise.resolve());
      TestBed.configureTestingModule({
        declarations: [ItemInputCopyComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule, ReactiveFormsModule],
        providers: [
          { provide: ClipboardService, useValue: clipboardServiceSpy },
          { provide: ToastService, useValue: toastServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ItemInputCopyComponent);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call write in ClipboardService when call copyToClipboard', async () => {
    clipboardServiceSpy.write.and.returnValue(of({}).toPromise());
    component.copyToClipboard();
    expect(clipboardServiceSpy.write).toHaveBeenCalledTimes(1);
  });

  it('should call write with dataInput when copyToClipboard is called', async () => {
    component.dataInput = 'test';
    const expectedArg = { url: 'test' };
    fixture.detectChanges();
    component.copyToClipboard();
    fixture.whenStable().then(() => {
      expect(clipboardServiceSpy.write).toHaveBeenCalledWith(expectedArg);
    });
  });

  it('should call showToast when copyToClipboard is called', async () => {
    component.dataInput = '';
    fixture.detectChanges();
    component.copyToClipboard();
    fixture.whenStable().then(() => {
      expect(toastServiceSpy.showToast).toHaveBeenCalledTimes(1);
    });
  });

  it('should set value on input on ngOnInit ', async () => {
    component.dataInput = '1234';
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.form.value).toEqual({ data: '1234' });
    });
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
