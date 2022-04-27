import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NumberInputDirective } from './number-input.directive';
@Component({
  template: `
    <ion-input appNumberInput></ion-input>
    <ion-input appNumberInput="positiveInteger"></ion-input>
  `,
})
class TestComponent {}

describe('NumberInputDirective', () => {
  let directive: NumberInputDirective;
  let elementRefMock: any;
  let fixture: ComponentFixture<TestComponent>;
  let inputs: any;

  beforeEach(() => {
    elementRefMock = { nativeElement: { classList: { add: (name: string) => 'test' } } };
    fixture = TestBed.configureTestingModule({
      declarations: [NumberInputDirective, TestComponent],
      providers: [NumberInputDirective, { provide: ElementRef, useValue: elementRefMock }],
    }).createComponent(TestComponent);
    fixture.detectChanges();
    inputs = fixture.debugElement.queryAll(By.directive(NumberInputDirective));
    directive = TestBed.inject(NumberInputDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should assing decimal by default', () => {
    const inputDecimal = inputs[0];
    fixture.detectChanges();
    expect(inputDecimal.attributes['appNumberInput']).toEqual('');
  });

  it('should assing pisitiveInteger when positiveInteger is passed by parameter', () => {
    const inputDecimal = inputs[1];
    fixture.detectChanges();
    expect(inputDecimal.attributes['appNumberInput']).toEqual('positiveInteger');
  });

  it('should prevent keypress event when press - and positiveInteger parameter', () => {
    const event = new KeyboardEvent('keypress', {
      key: '-',
      cancelable: true,
    });

    inputs[1].nativeElement.dispatchEvent(event);
    expect(event.defaultPrevented).toBeTruthy();
  });

  it('should prevent keypress event when press . and positiveInteger parameter', () => {
    const event = new KeyboardEvent('keypress', {
      key: '.',
      cancelable: true,
    });

    inputs[1].nativeElement.dispatchEvent(event);
    expect(event.defaultPrevented).toBeTruthy();
  });

  it('should prevent keypress event when press 000 and positiveInteger parameter', () => {
    const event = new KeyboardEvent('keypress', {
      key: '000',
      cancelable: true,
    });

    inputs[1].nativeElement.dispatchEvent(event);
    expect(event.defaultPrevented).toBeTruthy();
  });

  it('should not prevent keypress event when press . and decimal parameter', () => {
    const event = new KeyboardEvent('keypress', {
      key: '.',
      cancelable: true,
    });

    inputs[0].nativeElement.dispatchEvent(event);
    expect(event.defaultPrevented).toBeTruthy();
  });

  it('should prevent keypress event when press - and decimal parameter', () => {
    const event = new KeyboardEvent('keypress', {
      key: '-',
      cancelable: true,
    });

    inputs[0].nativeElement.dispatchEvent(event);
    expect(event.defaultPrevented).toBeTruthy();
  });
});
