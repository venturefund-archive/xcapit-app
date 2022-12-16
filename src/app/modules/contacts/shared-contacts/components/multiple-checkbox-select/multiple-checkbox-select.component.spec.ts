import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultipleCheckboxSelectComponent } from './multiple-checkbox-select.component';

describe('MultipleCheckboxSelectComponent', () => {
  let component: MultipleCheckboxSelectComponent;
  let fixture: ComponentFixture<MultipleCheckboxSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleCheckboxSelectComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleCheckboxSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
