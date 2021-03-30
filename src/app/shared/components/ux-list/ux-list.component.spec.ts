import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UxListComponent } from './ux-list.component';

describe('UxListComponent', () => {
  let component: UxListComponent;
  let fixture: ComponentFixture<UxListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UxListComponent ],
      imports: [IonicModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
