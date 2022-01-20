import { TestBed, ComponentFixture, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ButtonSpinnerDirective } from './button-spinner.directive';
import { delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

@Component({
  template: `
    <div>
      <ion-button [loading]="this.loadingB1" (click)="this.toggleB1()" id="b1">Button 1</ion-button>
      <ion-button [loading]="this.loadingB2" loadingText="Loading..." (click)="this.toggleB2()" id="b2"
        >Button 2</ion-button
      >
    </div>
  `,
})
class TestComponent {
  loadingB1 = false;
  loadingB2 = false;

  toggleB1() {
    this.loadingB1 = !this.loadingB1;
  }

  toggleB2() {
    this.loadingB2 = !this.loadingB2;
  }
}

fdescribe('ButtonSpinnerDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, ButtonSpinnerDirective],
        imports: [IonicModule.forRoot()],
        providers: [],
      });
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  fit('should toggle loading on button 1', () => {
    const button = fixture.debugElement.query(By.css('#b1')).nativeElement;
    expect(button.innerHTML).toContain('Button 1');
    button.click();
    fixture.detectChanges();
    expect(button.innerHTML).toContain('<ion-spinner name="crescent"></ion-spinner> Button 1');
    component.toggleB1();
    fixture.detectChanges();
    expect(button.innerHTML).toContain('Button 1');
  });

  fit('should toggle loading on button 2', () => {
    const button = fixture.debugElement.query(By.css('#b2')).nativeElement;
    expect(button.innerHTML).toContain('Button 2');
    button.click();
    fixture.detectChanges();
    expect(button.innerHTML).toContain('<ion-spinner name="crescent"></ion-spinner> Loading...');
    component.toggleB2();
    fixture.detectChanges();
    expect(button.innerHTML).toContain('Button 2');
  });
});
