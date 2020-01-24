import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstStepsPage } from './first-steps.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonSlides } from '@ionic/angular';

class IonSlidesMock {
  public constructor() {}

  public getActiveIndex = () => Promise.resolve(1);
  public length = () => Promise.resolve(1);
  public slideNext = () => Promise.resolve();
  public slidePrev = () => Promise.resolve();
}

describe('FirstStepsPage', () => {
  let component: FirstStepsPage;
  let fixture: ComponentFixture<FirstStepsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FirstStepsPage],
      imports: [RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: IonSlides, useClass: IonSlidesMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstStepsPage);
    component = fixture.componentInstance;
    component.slide = TestBed.get(IonSlides);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setActualStep on init', () => {
    const spy = spyOn(component, 'setActualStep');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call setSliderLength on init', () => {
    const spy = spyOn(component, 'setSliderLength');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call slide back when slideNext is called', () => {
    const spy = spyOn(component.slide, 'slideNext');
    component.slideNext();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call slide back when slidePrev is called', () => {
    const spy = spyOn(component.slide, 'slidePrev');
    component.slideBack();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
