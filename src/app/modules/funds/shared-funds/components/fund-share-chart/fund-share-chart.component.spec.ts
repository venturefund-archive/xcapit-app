import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FundShareChartComponent } from './fund-share-chart.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModalController } from '@ionic/angular';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { RouterTestingModule } from '@angular/router/testing';

describe('FundShareChartComponent', () => {
  let component: FundShareChartComponent;
  let fixture: ComponentFixture<FundShareChartComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundShareChartComponent>;
  let modalControllerSpy: any;
  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );

    TestBed.configureTestingModule({
      declarations: [FundShareChartComponent, TrackClickDirective],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundShareChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ModalController dismiss on close', () => {
    component.close();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Close is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Close'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
