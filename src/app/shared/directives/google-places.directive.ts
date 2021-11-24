import { Directive, ElementRef, OnInit } from '@angular/core';
declare let google: any;

@Directive({
  selector: '[appGooglePlaces]',
})
export class GooglePlacesDirective implements OnInit {
  private element: HTMLIonInputElement;

  constructor(private elementRef: ElementRef) {
    this.element = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.element.componentOnReady().then(() => {
      const input: HTMLInputElement = this.element.querySelector('input');
      const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['address'],
      });
      autocomplete.addListener('place_changed', () => {
        this.element.value = autocomplete.getPlace().formatted_address;
      });
    });
  }
}
