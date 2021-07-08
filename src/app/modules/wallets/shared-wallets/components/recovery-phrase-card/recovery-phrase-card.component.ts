import { Component, OnInit } from '@angular/core';
import { StorageWalletsService } from '../../services/storage-wallets/storage-wallets.service';

@Component({
  selector: 'app-recovery-phrase-card',
  template: `
    <ion-card>
      <div *ngFor="let word of this.words">
        <app-recovery-word-button [word]="word" class="ion-margin"></app-recovery-word-button>
      </div>
    </ion-card>
  `,
  styleUrls: ['./recovery-phrase-card.component.scss'],
})
export class RecoveryPhraseCardComponent implements OnInit {
  ordered = true;
  words: string[];

  constructor(private storageWalletsService: StorageWalletsService) {}

  ngOnInit() {
    this.storageWalletsService.getRecoveryPhrase().subscribe((words) => {
      this.words = words;

      if (this.ordered) {
        this.words.sort();
      }
    });
  }
}
