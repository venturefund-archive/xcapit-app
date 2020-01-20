import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LanguagePopoverComponent } from '../language-popover/language-popover.component';

@Component({
  selector: 'app-language-button',
  template: `
    <ion-button
      (click)="this.openLanguagePopover($event)"
      icon-only
      appTrackClickUnauth
      fill="clear"
      class="language_button"
      name="Open Language Popover"
    >
      <ion-icon name="globe"></ion-icon>
    </ion-button>
  `,
  styleUrls: ['./language-button.component.scss']
})
export class LanguageButtonComponent implements OnInit {
  constructor(private popoverController: PopoverController) {}

  ngOnInit() {}

  async openLanguagePopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LanguagePopoverComponent,
      event: ev
    });
    await popover.present();
  }
}
