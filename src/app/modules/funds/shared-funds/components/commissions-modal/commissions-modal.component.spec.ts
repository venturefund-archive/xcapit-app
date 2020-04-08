import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommissionsModalComponent } from './commissions-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

describe('CommissionsModalComponent', () => {
  let component: CommissionsModalComponent;
  let fixture: ComponentFixture<CommissionsModalComponent>;
  let modalControllerSpy: any;
  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );

    TestBed.configureTestingModule({
      declarations: [CommissionsModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ModalController dissmiss on closeModal click', () => {
    component.closeModal();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
