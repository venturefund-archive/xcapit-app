import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveTutorialPage } from './interactive-tutorial.page';
import { ModalController } from '@ionic/angular';

describe('InteractiveTutorialPage', () => {
  let component: InteractiveTutorialPage;
  let fixture: ComponentFixture<InteractiveTutorialPage>;
  let modalControllerSpy: any;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);
    TestBed.configureTestingModule({
      declarations: [ InteractiveTutorialPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveTutorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
