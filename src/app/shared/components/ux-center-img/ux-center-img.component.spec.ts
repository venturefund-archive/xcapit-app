import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UxCenterImgComponent } from './ux-center-img.component';
import { IonicModule } from '@ionic/angular';

@Component({
  template: `
    <div>
      <app-ux-center-img [imagePath]="this.data.image"></app-ux-center-img>
    </div>
  `,
})
class TestComponent {
  data = { image: 'assets/img/non-default.svg' };
}

describe('UxCenterImgComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, UxCenterImgComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default image in div', () => {
    delete component.data.image;
    fixture.detectChanges();
    const imageEl = fixture.debugElement.query(By.css('img'));
    expect(imageEl.nativeElement.src).toContain('assets/img/ux-success.svg');
  });

  it('should render non default image in div', () => {
    const imageEl = fixture.debugElement.query(By.css('img'));
    expect(imageEl.nativeElement.src).toContain('assets/img/non-default.svg');
  });
});
