import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaTutorialModalComponent } from './ca-tutorial-modal.component';
import { ModalController } from '@ionic/angular';

describe('CaTutorialModalComponent', () => {
  let component: CaTutorialModalComponent;
  let fixture: ComponentFixture<CaTutorialModalComponent>;
  let modalControllerSpy: any;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);
    TestBed.configureTestingModule({
      declarations: [ CaTutorialModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
