import { ElementRef } from '@angular/core';
import { NumberInputDirective } from './number-input.directive';
import { SpyProperty } from '../../../../testing/spy-property.spec';

describe('NumberInputDirective', () => {
  let directive: NumberInputDirective;
  let elementRefSpy: jasmine.SpyObj<ElementRef>;
  let eventSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    elementRefSpy = jasmine.createSpyObj(
      'ElementRef',
      {},
      { nativeElement: { getElementsByTagName: () => [{ value: '15' }] } }
    );
    eventSpy = jasmine.createSpyObj('EventSpy', { preventDefault: null }, { which: 53, keyCode: 56 });
    directive = new NumberInputDirective(elementRefSpy);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should admit integers', () => {
    expect(directive.onInput(eventSpy)).toBeTrue();
  });

  it('should not admit letters', () => {
    new SpyProperty(eventSpy, 'which').value().and.returnValue(1052);
    expect(directive.onInput(eventSpy)).toBeFalse();
  });

  it('should not admit decimal on positive integer pattern', () => {
    directive.appNumberInput = 'positiveInteger';
    new SpyProperty(eventSpy, 'which').value().and.returnValue(44);
    expect(directive.onInput(eventSpy)).toBeFalse();
  });

  it('should return false when keyCode is a letter', () => {
    new SpyProperty(eventSpy, 'keyCode').value().and.returnValue(1052);
    new SpyProperty(eventSpy, 'which').value().and.returnValue(null);
    expect(directive.onInput(eventSpy)).toBeFalse();
  });
});
