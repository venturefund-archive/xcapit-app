import { TestBed, ComponentFixture, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ButtonSpinnerDirective } from './button-spinner.directive';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

@Component({
  template: `
    <div>
      <ion-button [appLoading]="this.loadingB1" (click)="this.toggleB1()" id="b1">Button 1</ion-button>
      <ion-button [appLoading]="this.loadingB2" loadingText="Loading..." (click)="this.toggleB2()" id="b2"
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

describe('ButtonSpinnerDirective', () => {
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

  it('should toggle loading on button 1', () => {
    const button = fixture.debugElement.query(By.css('#b1')).nativeElement;
    expect(button.innerHTML).toContain('Button 1');
    button.click();
    fixture.detectChanges();
    expect(button.innerHTML).toContain(
      '<ion-spinner style="margin-right: 10px" color="uxprimary" name="crescent"></ion-spinner> Button 1'
    );
    component.toggleB1();
    fixture.detectChanges();
    expect(button.innerHTML).toContain('Button 1');
  });

  it('should toggle loading on button 2', () => {
    const button = fixture.debugElement.query(By.css('#b2')).nativeElement;
    expect(button.innerHTML).toContain('Button 2');
    button.click();
    fixture.detectChanges();
    expect(button.innerHTML).toContain(
      '<ion-spinner style="margin-right: 10px" color="uxprimary" name="crescent"></ion-spinner> Loading...'
    );
    component.toggleB2();
    fixture.detectChanges();
    expect(button.innerHTML).toContain('Button 2');
  });
});
