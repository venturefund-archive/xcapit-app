import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { UxSelectModalComponent } from './ux-select-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from '../../directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UxSelectModalComponent', () => {
  let component: UxSelectModalComponent;
  let fixture: ComponentFixture<UxSelectModalComponent>;
  let modalControllerMock;
  let modalController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UxSelectModalComponent>;

  beforeEach(async(() => {
    modalControllerMock = {
      create: Promise.resolve({
        present: () => Promise.resolve(),
        onDidDismiss: () => Promise.resolve({})
      }),
      dismiss: Promise.resolve()
    };

    TestBed.configureTestingModule({
      declarations: [UxSelectModalComponent, TrackClickDirective],

      imports: [IonicModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        {
          provide: ModalController,
          useValue: modalControllerMock
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalController = TestBed.get(ModalController);
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

  it('should call modalController.dismiss on select', async done => {
    const spy = spyOn(modalController, 'dismiss');
    spy.and.returnValue('Test');
    component.select({ detail: { value: 'Test' } });
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
    done();
  });

  it('should call modalController.dismiss on close', async done => {
    const spy = spyOn(modalController, 'dismiss');
    spy.and.returnValue('Test');
    component.close();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
    done();
  });

  it('should call trackEvent on trackService when Create Fund button clicked', () => {
    const spyModal = spyOn(modalController, 'dismiss');
    spyModal.and.returnValue('Test');
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Close'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
