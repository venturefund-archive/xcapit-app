import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommissionsModalComponent } from './commissions-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ModalController } from '@ionic/angular';

describe('CommissionsModalComponent', () => {
  let component: CommissionsModalComponent;
  let fixture: ComponentFixture<CommissionsModalComponent>;
  let modalControllerSpy: any;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', [
      'create',
      'dismiss'
    ]);
    modalControllerSpy.create.and.returnValue(
      of({
        present: () => {},
        onWillDismiss: () => of({}).toPromise()
      }).toPromise()
    );
    modalControllerSpy.dismiss.and.returnValue(of({}));
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
