import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-recovery-word',
  template: `
    <ion-button
      name="Recovery Word"
      size="small"
      class="word ux-font-text-xxs"
      color="primary"
      [disabled]="!this.isActivated"
      (click)="useValue(this.word)"
    >
      {{ this.showOrder ? index + 1 + '.' : '' }}
      {{ this.word | hideText: this.hidePhrase}}
    </ion-button>
  `,
  styleUrls: ['./recovery-word.component.scss'],
})
export class RecoveryWordComponent implements OnInit {
  @Input() word: string;
  
  @Input() index: number;
  @Input() showOrder: boolean;
  @Input() clickable: boolean;
  @Output() useButtonClicked: EventEmitter<string> = new EventEmitter<string>();
  isActivated = true;
  hidePhrase: boolean;
  
  constructor(
    private localStorageService: LocalStorageService
  ) {
    
  }

  ngOnInit() {
    this.subscribeOnHidePhrase();
  }

  useValue(word: string) {
    if (this.clickable) {
      this.useButtonClicked.emit(word);
      this.isActivated = false;
    }
  }
  subscribeOnHidePhrase() {
    this.localStorageService.hidePhrase.subscribe((res) => (this.hidePhrase = res));
  }


}
