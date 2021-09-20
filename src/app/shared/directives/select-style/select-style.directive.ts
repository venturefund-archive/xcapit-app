import { Directive, ElementRef, Input, OnInit } from '@angular/core';
@Directive({
  selector: '[appSelectStyle]',
})
export class SelectStyleDirective implements OnInit {
  @Input() appSelectStyle: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.appSelectStyle = this.appSelectStyle || 'classic';
    this.setStyleClass();
  }

  setStyleClass() {
    this.el.nativeElement.classList.add(this.appSelectStyle);
  }
}
