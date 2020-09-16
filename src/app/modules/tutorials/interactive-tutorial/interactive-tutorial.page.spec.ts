import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveTutorialPage } from './interactive-tutorial.page';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { SharedTutorialsModule } from '../shared-tutorials/shared-tutorials.module';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

describe('InteractiveTutorialPage', () => {
  let component: InteractiveTutorialPage;
  let fixture: ComponentFixture<InteractiveTutorialPage>;
  let modalControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<
    InteractiveTutorialPage
  >;
  let toastServiceSpy: any;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    TestBed.configureTestingModule({
      declarations: [InteractiveTutorialPage, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        SharedTutorialsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'tabs/funds', component: DummyComponent },
          { path: 'funds/action/new', component: DummyComponent }
        ])
      ],
      providers: [
        TrackClickDirective,
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveTutorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalControllerSpy = TestBed.inject(ModalController);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open Binance Transfer Tutorial', async (done) => {
    component.openBinanceTransferTutorial().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
    done();
  });

  it('should open Binance Tutorial', async (done) => {
    component.openBinanceTutorial().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
    done();
  });

  it('should open CA Tutorial', async (done) => {
    component.openCaTutorial().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
    done();
  });

  it('should call trackEvent on trackService when No CA button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'No CA'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Yes CA button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Yes CA'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when No Binance Account button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'No Binance Account'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Yes Binance Account button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Yes Binance Account'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when No Binance Transfer button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'No Binance Transfer'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Yes Binance Transfer button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Yes Binance Transfer'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
