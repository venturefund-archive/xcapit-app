import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language/language.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-language-popover',
  template: `
    <ion-list>
      <ion-item
        button
        *ngFor="let lng of this.languages"
        name="Change Language Item"
        (click)="this.select(lng.value)"
        appTrackClickUnauth
        [dataToTrack]="{
          eventLabel: 'Select Language',
          description: lng.value
        }"
        detail="false"
      >
        <ion-label class="ion-text-wrap">{{ lng.text }}</ion-label>
        <ion-icon
          slot="end"
          name="checkmark"
          *ngIf="lng.value === this.selected"
        ></ion-icon>
      </ion-item>
    </ion-list>
  `,
  styleUrls: ['./language-popover.component.scss']
})
export class LanguagePopoverComponent implements OnInit {
  languages: any[];
  selected: string;

  constructor(
    private languageService: LanguageService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.selected = this.languageService.selected;
  }

  select(lng: string) {
    this.languageService.setLanguage(lng);
    this.popoverController.dismiss();
  }
}
