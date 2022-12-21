import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridPro } from '@vaadin/grid-pro';
import '@vaadin/grid-pro';
import '@vaadin/grid-pro/vaadin-grid-pro-edit-column.js';
import { VaadinGridRendererDirective } from './vaadin-grid.directive';
import { enter, write } from './tests/helpers';
import {
  getBodyCell,
  getEditorInput,
  getGridPro,
  gridRender,
} from './tests/grid-helpers';

interface Person {
  name: string;
}

function generateData(count: number): Person[] {
  const result: Person[] = [];

  for (let index = 0; index < count; index++) {
    result.push({ name: `Person ${index}` });
  }

  return result;
}

describe('vaadin-grid-pro.directive', () => {
  @Component({
    template: `
      <vaadin-grid-pro [items]="items">
        <!-- Default text editor -->
        <vaadin-grid-pro-edit-column
          path="name"
          header="Name"
        ></vaadin-grid-pro-edit-column>
      </vaadin-grid-pro>
    `,
  })
  class TestComponent {
    items: Person[] = [];
  }

  let fixture: ComponentFixture<TestComponent>;
  let grid: GridPro;

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      declarations: [VaadinGridRendererDirective, TestComponent],
    }).createComponent(TestComponent);
    fixture.componentInstance.items = generateData(10);
    fixture.detectChanges();
    await gridRender(fixture);
    grid = getGridPro();
  });

  describe('default editor', () => {
    it('should edit using default editor', async () => {
      const cell = getBodyCell(grid, 0, 0);
      enter(cell);

      const input = getEditorInput(grid, 0, 0);
      write(input, 'Updated name');
      enter(input);

      expect(fixture.componentInstance.items[0].name).toEqual('Updated name');

      await gridRender(fixture);
      expect(getBodyCell(grid, 0, 0).textContent).toEqual('Updated name');
    });
  });
});
