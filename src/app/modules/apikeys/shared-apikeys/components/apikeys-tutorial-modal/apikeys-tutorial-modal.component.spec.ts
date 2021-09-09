import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ApikeysTutorialModalComponent } from './apikeys-tutorial-modal.component';

describe('ApikeysTutorialModalComponent', () => {
  let component: ApikeysTutorialModalComponent;
  let fixture: ComponentFixture<ApikeysTutorialModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ApikeysTutorialModalComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ApikeysTutorialModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
