import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TrackClickUnauthDirective } from 'src/app/shared/directives/track-click-unauth/track-click-unauth.directive';

export class TrackClickUnauthDirectiveTestHelper<T> {
  fixture: ComponentFixture<T>;

  constructor(fixture: ComponentFixture<T>) {
    this.fixture = fixture;
  }

  getByElementByName(element: string, name: string) {
    return this.fixture.debugElement.query(
      By.css(`${element}[name="${name}"]`)
    );
  }

  getElement(element: string) {
    return this.fixture.debugElement.query(By.css(`${element}`));
  }

  getDirective(element: DebugElement): TrackClickUnauthDirective {
    return element.injector.get(
      TrackClickUnauthDirective
    ) as TrackClickUnauthDirective;
  }

  getAllElementsWithTheDirective() {
    return this.fixture.debugElement.queryAll(
      By.directive(TrackClickUnauthDirective)
    );
  }

  getFirstElementWithTheDirective() {
    const all = this.getAllElementsWithTheDirective();
    return all.length ? all[0] : null;
  }

  getLastElementWithTheDirective() {
    const all = this.getAllElementsWithTheDirective();
    return all.length ? all[all.length - 1] : null;
  }
}
