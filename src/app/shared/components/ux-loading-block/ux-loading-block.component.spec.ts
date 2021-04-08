import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UxLoadingBlockComponent } from './ux-loading-block.component';

describe('UxLoadingBlockComponent', () => {
  let component: UxLoadingBlockComponent;
  let fixture: ComponentFixture<UxLoadingBlockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UxLoadingBlockComponent ],
      imports: [IonicModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UxLoadingBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
