import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { UxInputSelectImageComponent } from './ux-input-select-image.component';

describe('UxInputSelectImageComponent', () => {
  let component: UxInputSelectImageComponent;
  let fixture: ComponentFixture<UxInputSelectImageComponent>;
  let modalControllerSpy: any;
  let formGroupDirectiveMock: any;
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
        declarations: [UxInputSelectImageComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: AbstractControl, useValue: abstractControlMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(UxInputSelectImageComponent);
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
