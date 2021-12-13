import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-ux-radio-item-group',
  template: `
    <div class="rig">
      <ion-list>
        <ion-radio-group [formControlName]="this.controlName">
          <div class="rig__option" *ngFor="let label of this.labels; index as i">
            <app-ux-radio-item [value]="this.values[i]" [label]="label"></app-ux-radio-item>
          </div>
        </ion-radio-group>
      </ion-list>
    </div>
  `,
  styleUrls: ['./ux-radio-item-group.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class UxRadioItemGroupComponent implements OnInit {
  @Input() labels: string[];
  @Input() values: string[];
  @Input() controlName: string;

  constructor() {}

  ngOnInit() {}
}
