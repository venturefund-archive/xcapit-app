import { Component, Input, OnInit } from '@angular/core';
import { kStringMaxLength } from 'buffer';

@Component({
  selector: 'app-embed-video',
  template: `
    <div class="embed-container">
      <iframe class="iframe" [src]="this.url | safeURL" title="" frameborder="0" allowfullscreen></iframe>
    </div>
  `,
  styleUrls: ['./embed-video.component.scss'],
})
export class EmbedVideoComponent implements OnInit {
  @Input() url: string;
  constructor() {}
  ngOnInit() {}
}
