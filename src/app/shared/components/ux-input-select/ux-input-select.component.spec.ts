import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxInputSelectComponent } from './ux-input-select.component';
import { FormGroupDirective } from '@angular/forms';
import {  ModalController } from '@ionic/angular';

describe('UxInputSelectComponent', () => {
  let component: UxInputSelectComponent;
  let fixture: ComponentFixture<UxInputSelectComponent>;
  let formGroupDirectiveMock: any;
  let modalControllerMock: any;
  let modalController: any;
  beforeEach(async(() => {

    formGroupDirectiveMock = {
      control: {
        get: () => {
          return { value: 'test' };
        }
      }
    };
    modalControllerMock = {
      create: Promise.resolve({
        present: () => Promise.resolve(),
        onDidDismiss: () => Promise.resolve({})
      }),
      dismiss: Promise.resolve()
    };
    TestBed.configureTestingModule({
      declarations: [UxInputSelectComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
        { provide: ModalController, useValue: modalControllerMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxInputSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalController = TestBed.get(ModalController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call modal.create on openModal', async done => {
    const spy = spyOn(modalController, 'create');
    spy.and.returnValue(
      Promise.resolve({
        present: () => Promise.resolve(),
        onDidDismiss: () => Promise.resolve({})
      })
    );
    component.openModal(undefined);
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });

});
