import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { UxSelectModalComponent } from './ux-select-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from '../../directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

describe('UxSelectModalComponent', () => {
  let component: UxSelectModalComponent;
  let fixture: ComponentFixture<UxSelectModalComponent>;
  let modalControllerSpy: any;
  let modalController: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UxSelectModalComponent>;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);

      TestBed.configureTestingModule({
        declarations: [UxSelectModalComponent, FakeTrackClickDirective],

        imports: [IonicModule, ReactiveFormsModule, HttpClientTestingModule],
        providers: [
          {
            provide: ModalController,
            useValue: modalControllerSpy,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UxSelectModalComponent);
    component = fixture.componentInstance;
    component.rawData = true;
    fixture.detectChanges();
    modalController = TestBed.inject(ModalController);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setSelected on init', () => {
    const spy = spyOn(component, 'setSelected');
    component.ngOnInit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call modalController.dismiss on select', () => {
    component.select({ detail: { value: 'Test' } });
    fixture.detectChanges();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call modalController.dismiss on close', () => {
    modalControllerSpy.dismiss.and.returnValue('Test');
    component.close();
    fixture.detectChanges();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Create Fund button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
