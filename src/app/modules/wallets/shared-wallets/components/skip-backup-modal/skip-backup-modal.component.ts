import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skip-backup-modal',
  template: `
  <div>
    <p>Hola</p>
    <div>
      <ion-button expand="block" fill="clear" shape="round">
        Atras
      </ion-button>
      <ion-button expand="block" fill="clear" shape="round">
        Omitir
      </ion-button>
    </div>
  </div>`,
  styleUrls: ['./skip-backup-modal.component.scss'],
})
export class SkipBackupModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
