import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-embed-video',
  template: `
    <div class="embed-container">
      <iframe
        class="iframe"
        src="https://www.youtube.com/embed/2tr-aQ78Ohg"
        title=""
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  `,
  styleUrls: ['./embed-video.component.scss'],
})
export class EmbedVideoComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
