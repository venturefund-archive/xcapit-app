import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaTutorialModalComponent } from './ca-tutorial-modal.component';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

describe('CaTutorialModalComponent', () => {
  let component: CaTutorialModalComponent;
  let fixture: ComponentFixture<CaTutorialModalComponent>;
  let modalControllerSpy: any;

  beforeEach(waitForAsync(() => {
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );
    TestBed.configureTestingModule({
      declarations: [ CaTutorialModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaTutorialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalControllerSpy = TestBed.inject(ModalController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    component.closeModal();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
