import { Component, DebugElement, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SelectStyleDirective } from './select-style.directive';
@Component({
  template: `
    <div appSelectStyle></div>
    <div appSelectStyle="white"></div>
  `,
})
class TestComponent {}

fdescribe('SelectStyleDirective', () => {
  let directive: SelectStyleDirective;
  let elementRefMock: any;
  let fixture: ComponentFixture<TestComponent>;
  let divs: any;

  beforeEach(() => {
    elementRefMock = { nativeElement: { classList: { add: (name: string) => 'test' } } };
    fixture = TestBed.configureTestingModule({
      declarations: [SelectStyleDirective, TestComponent],
      providers: [SelectStyleDirective, { provide: ElementRef, useValue: elementRefMock }],
    }).createComponent(TestComponent);
    fixture.detectChanges();
    divs = fixture.debugElement.queryAll(By.directive(SelectStyleDirective));
    directive = TestBed.inject(SelectStyleDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should assing classic by default', () => {
    const divClassic = divs[0];
    directive.ngOnInit();
    fixture.detectChanges();
    expect(divClassic.nativeElement.classList).toContain('classic');
  });

  it('should assing white class when white is passed by parameter', () => {
    const divWhite = divs[1];
    directive.ngOnInit();
    fixture.detectChanges();
    expect(divWhite.nativeElement.classList).toContain('white');
  });
});
