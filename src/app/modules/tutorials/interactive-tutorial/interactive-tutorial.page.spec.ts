import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveTutorialPage } from './interactive-tutorial.page';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { SharedTutorialsModule } from '../shared-tutorials/shared-tutorials.module';

describe('InteractiveTutorialPage', () => {
  let component: InteractiveTutorialPage;
  let fixture: ComponentFixture<InteractiveTutorialPage>;
  let modalControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<
    InteractiveTutorialPage
  >;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', [
      'create',
      'dismiss'
    ]);
    modalControllerSpy.create.and.returnValue(
      of({ present: () => {}, onWillDismiss: () => of({}).toPromise() }).toPromise()
    );
    TestBed.configureTestingModule({
      declarations: [InteractiveTutorialPage, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        SharedTutorialsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([{ path: 'funds/list', component: DummyComponent }])
      ],
      providers: [
        TrackClickDirective,
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveTutorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalControllerSpy = TestBed.get(ModalController);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open Binance Trtansfer Tutorial', () => {
    component.openBinanceTransferTutorial().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
  });

  it('should open Binance Tutorial', () => {
    component.openBinanceTutorial().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
  });

  it('should open CA Tutorial', () => {
    component.openCaTutorial().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
  });
});
