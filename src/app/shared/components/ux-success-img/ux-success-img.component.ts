import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ux-success-img',
  template: `
    <div class="text-center">
      <img src="../../assets/img/ux-success.svg" alt="Success img" />
    </div>
  `,
  styleUrls: ['./ux-success-img.component.scss']
})
export class UxSuccessImgComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
