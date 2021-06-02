import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ToastAlertComponent } from './toast-alert.component';

describe('ToastAlertComponent', () => {
  let component: ToastAlertComponent;
  let fixture: ComponentFixture<ToastAlertComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ToastAlertComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ToastAlertComponent);
      component = fixture.componentInstance;
      component.type = 'error';
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
