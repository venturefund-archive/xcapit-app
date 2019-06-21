import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagePopoverComponent } from './language-popover.component';
import { LanguageService } from '../../services/language/language.service';
import { PopoverController } from '@ionic/angular';

describe('LanguagePopoverComponent', () => {
  let component: LanguagePopoverComponent;
  let fixture: ComponentFixture<LanguagePopoverComponent>;
  let languageServiceSpy: any;
  let popoverControllerSpy: any;

  beforeEach(async(() => {
    languageServiceSpy = jasmine.createSpyObj('LanguageService', [
      'getLanguages',
      'setLanguage'
    ]);
    popoverControllerSpy = jasmine.createSpyObj('PopoverController', ['dismiss']);

    TestBed.configureTestingModule({
      declarations: [LanguagePopoverComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: PopoverController, useValue: popoverControllerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    popoverControllerSpy = TestBed.get(PopoverController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be call dismiss on popoverController when call select', () => {
    component.select('');
    expect(popoverControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
