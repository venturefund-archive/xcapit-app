import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-method',
  template: `
  <div class="mc">
        <div class="mc__content">
          <div class="mc__content__both">
            <div class="mc__content__img">
              <ion-img [src]="this.img"></ion-img>  
            </div>
            <div class="mc__content__name">
              <div class="ux-font-lato ux-fweight-regular ux-fsize-12">
                <h2>{{ this.name }}</h2>
              </div>
            </div>
          </div>
          <div class="mc__content__right">
            <div class="button">
              <ion-button
                appTrackClick
                name="Manage"
                fill="clear"
                color = "uxmedium"
                size="small"
                slot="end"
                class="ux-font-lato ux-fweight-semibold ux-fsize-14"
              >
              <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
            </ion-button>
          </div>
          
          </div>
      </div>

  `,
  styleUrls: ['./method.component.scss'],
})
export class MethodComponent implements OnInit {
  @Input() name: String;
  @Input() img: any;

  constructor() { }

  ngOnInit() { }

}
