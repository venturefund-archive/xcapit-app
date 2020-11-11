import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ux-list-accordion',
  template: `
    <div class="ux_la">
      <div class="ux_la__header" (click)="toggleAccordion()">
        <div class="ux_la__header__right">
          <ion-text *ngIf="this.name">
            {{ this.name }}
          </ion-text>
        </div>
        <div class="ux_la__header__left">
          <div class="ux_la__header__left__left">
          <ion-text *ngIf="this.value">
            {{ this.value }}
          </ion-text>
          </div>
          <div class="ux_la__header__left__right">
          <ion-icon *ngIf="!isMenuOpen" name="chevron-up-outline"></ion-icon>
          <ion-icon *ngIf="isMenuOpen" name="chevron-down-outline"></ion-icon>
          </div>
        </div>
      </div>
      <div [ngClass]="this.isMenuOpen ? 'active' : 'inactive'" class="ux_la__body">
        <div class="ux_la__body__title">
          <ion-text *ngIf="this.title">
            {{ this.title }}
          </ion-text>
        </div>
        <div class="ux_la__body__description">
          <ion-text *ngIf="this.description">
            {{ this.description }}
          </ion-text>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./ux-list-accordion.component.scss'],
})
export class UxListAccordionComponent implements OnInit {
  @Input() name: string;
  @Input() value: string;
  @Input() title: string;
  @Input() description: string;
  public isMenuOpen: boolean = false;
  constructor() { }

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
