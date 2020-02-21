import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRangeModalComponent } from './custom-range-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

const formData = {
  valid: {
    selected: 15
  },
  invalid: {
    selected: ''
  }
};

describe('CustomRangeModalComponent', () => {
  let component: CustomRangeModalComponent;
  let fixture: ComponentFixture<CustomRangeModalComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<CustomRangeModalComponent>;
  let modalControllerMock: any;
  let modalControllerService;
  beforeEach(async(() => {
    modalControllerMock = {
      create: of({
        present: () => {},
        onWillDismiss: () => of({}).toPromise()
      }).toPromise(),
      dismiss: of().toPromise()
    };
    TestBed.configureTestingModule({
      declarations: [CustomRangeModalComponent, TrackClickDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        IonicModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [{ provide: ModalController, useValue: modalControllerMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalControllerService = TestBed.get(ModalController);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call modalControllerService.dismiss on handleSubmit and form valid', async done => {
    const spy = spyOn(modalControllerService, 'dismiss');
    spy.and.returnValue(of({}));
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    component.handleSubmit();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });

  it('should call trackEvent on trackService when Confirm button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Confirm'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Cancel button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Cancel'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
