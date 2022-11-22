import { CommaToDotDirective } from './comma-to-dot.directive';
import { ElementRef } from '@angular/core';

describe('CommaToDotDirective', () => {
  let directive: CommaToDotDirective;
  let elementRefSpy: jasmine.SpyObj<ElementRef>;
  beforeEach(() => {
    elementRefSpy = jasmine.createSpyObj('ElementRef', {}, { nativeElement: { value: '15' } });
    directive = new CommaToDotDirective(elementRefSpy);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should keep original value if not , in text', () => {
    directive.onInput();
    expect(elementRefSpy.nativeElement.value).toEqual('15');
  });

  it('should replace comma per dot', () => {
    elementRefSpy.nativeElement.value = '15,82';
    directive.onInput();
    expect(elementRefSpy.nativeElement.value).toEqual('15.82');
  });

  it('should do nothing if not a string input', () => {
    elementRefSpy.nativeElement.value = undefined;
    directive.onInput();
    expect(elementRefSpy.nativeElement.value).toEqual(undefined);
  });
});
