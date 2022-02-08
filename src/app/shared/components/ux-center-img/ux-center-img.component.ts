import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ux-center-img',
  template: `
    <div class="text-center">
      <img [src]="this.path" [alt]="imageAlt" />
    </div>
  `,
  styleUrls: ['./ux-center-img.component.scss'],
})
export class UxCenterImgComponent implements OnInit {
  @Input() imageAlt = 'Success img';
  path: string;
  @Input() set imagePath(path) {
    this.path = path ?? 'assets/img/ux-success.svg';
  }

  constructor() {}

  ngOnInit() {}
}
