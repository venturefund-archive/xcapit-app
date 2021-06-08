import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxInputSelectComponent } from './ux-input-select.component';
import { FormGroupDirective } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

describe('UxInputSelectComponent', () => {
  let component: UxInputSelectComponent;
  let fixture: ComponentFixture<UxInputSelectComponent>;
  let formGroupDirectiveMock: any;
  let modalControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
      formGroupDirectiveMock = {
        control: {
          get: () => {
            return { value: 'test' };
          },
        },
      };

      TestBed.configureTestingModule({
        declarations: [UxInputSelectComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UxInputSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call modal.create on openModal', () => {
    component.openModal(undefined);
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
