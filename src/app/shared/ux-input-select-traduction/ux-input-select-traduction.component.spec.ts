import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { UxInputSelectTraductionComponent } from './ux-input-select-traduction.component';
import { of } from 'rxjs';

describe('UxInputSelectTraductionComponent', () => {
  let component: UxInputSelectTraductionComponent;
  let fixture: ComponentFixture<UxInputSelectTraductionComponent>;
  let formGroupDirectiveMock: any;
  let modalControllerSpy: any;
  let abstractControlMock: any;
  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
      abstractControlMock = { subscribe: () => Promise.resolve('') };
      formGroupDirectiveMock = {
        control: {
          get: () => {
            return { value: 'test', valueChanges: { subscribe: () => of('') } };
          },
        },
      };
      TestBed.configureTestingModule({
        declarations: [UxInputSelectTraductionComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: AbstractControl, useValue: abstractControlMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(UxInputSelectTraductionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call modal.create on openModal', () => {
    component.openModal(undefined);
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
