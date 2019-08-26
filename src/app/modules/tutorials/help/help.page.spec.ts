import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPage } from './help.page';
import { TranslateModule } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { DynamicComponentService } from 'src/app/shared/services/dynamic-component/dynamic-component.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('HelpPage', () => {
  let component: HelpPage;
  let fixture: ComponentFixture<HelpPage>;
  let modalControllerSpy: any;
  let dynamicComponentServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HelpPage>;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    modalControllerSpy.create.and.returnValue(
      of({ present: () => {} }).toPromise()
    );
    dynamicComponentServiceSpy = jasmine.createSpyObj(
      'DynamicComponentService',
      ['getComponent']
    );
    TestBed.configureTestingModule({
      declarations: [HelpPage, TrackClickDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        {
          provide: DynamicComponentService,
          useValue: dynamicComponentServiceSpy
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open Extract Tutorial', () => {
    fixture.detectChanges();
    component.openTutorial('').then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
  });

  it('should call trackEvent on trackService when elements with the directive are clicked', () => {
    fixture.detectChanges();
    const elms = trackClickDirectiveHelper.getAllElementsWithTheDirective();
    for (const el of elms) {
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    }
    expect(elms.length).toBe(7);
  });
});
