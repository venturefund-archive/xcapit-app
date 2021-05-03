import { GooglePlacesDirective } from './google-places.directive';
import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

describe('GooglePlacesDirective', () => {
  let directive: GooglePlacesDirective;
  let elementRefSpy: any;
  beforeEach(() => {
    elementRefSpy = jasmine.createSpyObj('ElementRef', { nativeElement: () => {} });
    const bed = TestBed.configureTestingModule({
      providers: [GooglePlacesDirective, { provide: ElementRef, useValue: elementRefSpy }],
    });
    directive = bed.inject(GooglePlacesDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
