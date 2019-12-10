import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperComponent } from './stepper.component';

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepperComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 3 steps indicator', () => {
    component.steps = 3;
    component.ngOnChanges({
      steps: new SimpleChange(null, component.steps, false)
    });
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('.form-progress-indicator').length
    ).toEqual(3);
  });

  it('should have the second step active', () => {
    component.steps = 3;
    component.ngOnChanges({
      steps: new SimpleChange(null, component.steps, false)
    });
    component.activeStep = 2;
    component.ngOnChanges({
      activeStep: new SimpleChange(null, component.activeStep, false)
    });
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('.form-progress-indicator')[1].classList.toString()
    ).toContain('active');
  });

  it('should emmit the step clicked', () => {
    spyOn(component.clickStep, 'emit');
    component.steps = 3;
    component.ngOnChanges({
      steps: new SimpleChange(null, component.steps, false)
    });
    component.stepClicked(2);
    expect(component.clickStep.emit).toHaveBeenCalledTimes(1);
    expect(component.clickStep.emit).toHaveBeenCalledWith(2);
  });

  it('should emmit the step clicked when actually click', () => {
    spyOn(component.clickStep, 'emit');
    component.steps = 3;
    component.ngOnChanges({
      steps: new SimpleChange(null, component.steps, false)
    });
    fixture.detectChanges();
    fixture.nativeElement.querySelectorAll('.form-progress-indicator')[1].click();
    expect(component.clickStep.emit).toHaveBeenCalledTimes(1);
    expect(component.clickStep.emit).toHaveBeenCalledWith(2);
  });

  it('should not show steps when steps are 0', () => {
    component.steps = 0;
    component.ngOnChanges({
      steps: new SimpleChange(null, component.steps, false)
    });
    fixture.detectChanges();
    expect(
      fixture.nativeElement
        .querySelectorAll('.form-progress-indicator').length
    ).toEqual(0);
  });
});
