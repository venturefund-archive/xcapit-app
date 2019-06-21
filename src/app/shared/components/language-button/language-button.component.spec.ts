import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageButtonComponent } from './language-button.component';
import { PopoverController } from '@ionic/angular';

describe('LanguageButtonComponent', () => {
  let component: LanguageButtonComponent;
  let fixture: ComponentFixture<LanguageButtonComponent>;
  let popoverControllerSpy: any;

  beforeEach(async(() => {
    popoverControllerSpy = jasmine.createSpyObj('PopoverController', ['create']);

    TestBed.configureTestingModule({
      declarations: [ LanguageButtonComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: PopoverController, useValue: popoverControllerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    popoverControllerSpy = TestBed.get(PopoverController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be call create on popoverController when call openLanguagePopover', () => {
    component.openLanguagePopover(null);
    expect(popoverControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
