import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPage } from './help.page';
import { TranslateModule } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { LogsService } from 'src/app/shared/services/logs/logs.service';
import { DynamicComponentService } from 'src/app/shared/services/dynamic-component/dynamic-component.service';

describe('HelpPage', () => {
  let component: HelpPage;
  let fixture: ComponentFixture<HelpPage>;
  let modalControllerSpy: any;
  let logsServiceSpy: any;
  let dynamicComponentServiceSpy: any;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', [
      'create'
    ]);
    logsServiceSpy = jasmine.createSpyObj('LogService', ['log']);
    logsServiceSpy.log.and.returnValue(of({}));
    dynamicComponentServiceSpy = jasmine.createSpyObj(
      'DynamicComponentService',
      ['getComponent']
    );
    TestBed.configureTestingModule({
      declarations: [HelpPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: LogsService, useValue: logsServiceSpy },
        { provide: DynamicComponentService, useValue: dynamicComponentServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open Extract Tutorial', () => {
    fixture.detectChanges();
    component.openTutorial('', '').then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
  });

  it('should call log on ngOnInit', () => {
    fixture.detectChanges();
    expect(logsServiceSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should call log on openTutorial', () => {
    component.openTutorial('', '');
    expect(logsServiceSpy.log).toHaveBeenCalledTimes(1);
  });
});
