import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ErrorsFormItemComponent } from './components/errors-form-item/errors-form-item.component';

@NgModule({
  declarations: [ErrorsFormItemComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ErrorsFormItemComponent,
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class SharedModule { }
