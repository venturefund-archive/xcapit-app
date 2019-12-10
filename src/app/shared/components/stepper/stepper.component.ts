import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  selector: 'app-stepper',
  template: `
    <div class="scroll-area">
      <div class="form-progress">
        <progress
          #progress
          class="form-progress-bar"
          min="0"
          max="100"
          value="0"
          aria-labelledby="form-progress-completion"
        ></progress>

        <div class="steps">
          <div
            class="form-progress-indicator"
            *ngFor="let point of this.items"
            [class.active]="this.activeStep === point"
            [class.passed]="this.activeStep > point"
            (click)="this.stepClicked(point)"
          >
            <span>
              {{ point }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit, OnChanges {
  @Input() steps = 1;
  @Input() activeStep = 1;
  @ViewChild('progress', { static: true }) progress: ElementRef;
  @Output() clickStep = new EventEmitter<number>();
  items = [];
  private progressSegment: number;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.updateItems(changes.steps);
    this.updateProgress(changes.activeStep);
  }

  stepClicked(step: number) {
    this.clickStep.emit(step);
  }

  private updateItems(points: any) {
    if (points) {
      this.setItems();
    }
  }

  private setItems() {
    if (this.steps) {
      for (let index = 0; index < this.steps; index++) {
        this.items = [...this.items, index + 1];
      }
    }
  }

  private setProgressSegment() {
    this.progressSegment = Math.round(100 / (this.items.length - 1));
  }

  private getProgressValue(): number {
    return this.progressSegment * (this.activeStep - 1);
  }

  private updateProgress(activeStep: any) {
    if (activeStep && this.items.length) {
      this.setProgressSegment();
      this.progress.nativeElement.value = this.getProgressValue();
    }
  }
}
