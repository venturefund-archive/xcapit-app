import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UxSelectableListComponent } from './ux-selectable-list.component';

describe('UxSelectableListComponent', () => {
  let component: UxSelectableListComponent;
  let fixture: ComponentFixture<UxSelectableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UxSelectableListComponent ],
      imports: [IonicModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UxSelectableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
