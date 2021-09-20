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
  // let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let divs: any;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [SelectStyleDirective, TestComponent],
      providers: [SelectStyleDirective],
    }).createComponent(TestComponent);
    fixture.detectChanges();
    divs = fixture.debugElement.queryAll(By.directive(SelectStyleDirective));
    directive = TestBed.inject(SelectStyleDirective);
  });

  it('should assing classic by default', () => {
    const divClassic = divs[0].nativeElement.classList;
    directive.ngOnInit();
    fixture.detectChanges();
    expect(divClassic.nativeElement.classList).toBe('classic');
  });
});
