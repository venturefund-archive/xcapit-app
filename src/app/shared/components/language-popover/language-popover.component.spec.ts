import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagePopoverComponent } from './language-popover.component';
import { LanguageService } from '../../services/language/language.service';
import { PopoverController } from '@ionic/angular';
import { LogsService } from '../../services/logs/logs.service';
import { of } from 'rxjs';

describe('LanguagePopoverComponent', () => {
  let component: LanguagePopoverComponent;
  let fixture: ComponentFixture<LanguagePopoverComponent>;
  let languageServiceSpy: any;
  let popoverControllerSpy: any;
  let logsServiceMock: any;
  beforeEach(async(() => {
    logsServiceMock = {
      log: () => of({})
    };
    languageServiceSpy = jasmine.createSpyObj('LanguageService', [
      'getLanguages',
      'setLanguage'
    ]);
    popoverControllerSpy = jasmine.createSpyObj('PopoverController', [
      'dismiss'
    ]);

    TestBed.configureTestingModule({
      declarations: [LanguagePopoverComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: LogsService, useValue: logsServiceMock },
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
