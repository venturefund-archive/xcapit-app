import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-eye',
  template: ` <a class="eye" (click)="this.hideText()">
    <ion-icon src="assets/img/shared/eye/eye-close.svg" [hidden]="!this.hideFundText"></ion-icon>
    <ion-icon src="assets/img/shared/eye/eye-open.svg" [hidden]="this.hideFundText"></ion-icon>
  </a>`,
  styleUrls: ['./eye.component.scss'],
})
export class EyeComponent implements OnInit {
  hideFundText: boolean;
  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.subscribeOnHideFunds();
  }

  hideText() {
    this.localStorageService.toggleHideFunds();
  }

  subscribeOnHideFunds() {
    this.localStorageService.hideFunds.subscribe((res) => (this.hideFundText = res));
  }
}
