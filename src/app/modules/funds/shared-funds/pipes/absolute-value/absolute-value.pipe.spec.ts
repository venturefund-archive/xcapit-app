import { AbsoluteValuePipe } from './absolute-value.pipe';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

const mockData = [1, -1];

describe('AbsoluteValuePipe', () => {
  const pipe = new AbsoluteValuePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Shallow pipe test', () => {
    @Component({
      template: `
        Balance: {{ this.value | absoluteValue }}
      `
    })
    class TestComponent {
      value: any;
    }

    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let el: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, AbsoluteValuePipe]
      });
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      el = fixture.nativeElement;
    });

    it('shoud return 1', () => {
      component.value = mockData[0];
      fixture.detectChanges();
      expect(el.textContent).not.toContain('-1');
      expect(el.textContent).toContain('1');
    });

    it('shoud return 1', () => {
      component.value = mockData[1];
      fixture.detectChanges();
      expect(el.textContent).not.toContain('-1');
      expect(el.textContent).toContain('1');
    });
  });

  describe('Isolate pipe test', () => {
    it('shoud return 1', () => {
      expect(pipe.transform(mockData[0])).toBe(1);
    });

    it('shoud return 1', () => {
      expect(pipe.transform(mockData[1])).toBe(1);
    });
  });
});
