import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ux-center-img',
  template: `
    <div class="text-center">
      <img [src]="this.imagePath" [alt]="imageAlt" />
    </div>
  `,
  styleUrls: ['./ux-center-img.component.scss'],
})
export class UxCenterImgComponent implements OnInit {
  @Input() imageName = 'ux-success.svg';
  @Input() imageAlt = 'Success img';
  imagePath = '';
  constructor() {}

  ngOnInit() {
    this.getImagePath();
  }

  getImagePath() {
    this.imagePath = `../../assets/img/${this.imageName}`;
  }
}
