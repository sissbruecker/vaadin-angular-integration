import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridPro } from '@vaadin/grid-pro';
import '@vaadin/grid-pro';
import '@vaadin/grid-pro/vaadin-grid-pro-edit-column.js';
import {
  CustomGridEditor,
  VaadinGridProEditColumnDirective,
} from './vaadin-grid-pro.directive';
import { enter, write } from './tests/helpers';
import {
  getBodyCell,
  getEditorInput,
  getGridPro,
  gridRender,
} from './tests/grid-helpers';

interface Person {
  name: string;
  age: number;
}

function generateData(count: number): Person[] {
  const result: Person[] = [];

  for (let index = 0; index < count; index++) {
    result.push({ name: `Person ${index}`, age: index });
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
        <!-- Custom number editor -->
        <vaadin-grid-pro-edit-column
          path="age"
          header="Age"
          [editor]="ageEditor"
        >
          <test-custom-editor #ageEditor></test-custom-editor>
        </vaadin-grid-pro-edit-column>
      </vaadin-grid-pro>
    `,
  })
  class TestComponent {
    items: Person[] = [];
  }

  @Component({
    selector: 'test-custom-editor',
    template: `
      <input
        #inputField
        type="number"
        [value]="formatValue(value)"
        (input)="onInput($event)"
      />
    `,
  })
  class CustomEditor implements CustomGridEditor<number> {
    @Input() value: number = 0;
    @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;

    get nativeElement(): HTMLElement {
      return this.elementRef.nativeElement;
    }

    formatValue(value: number) {
      return value.toString();
    }

    onInput(event: Event) {
      this.value = parseInt((event.target as HTMLInputElement).value) || 0;
    }

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    focus(): void {
      this.inputField.nativeElement.focus();
    }
  }

  let fixture: ComponentFixture<TestComponent>;
  let grid: GridPro;

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        VaadinGridProEditColumnDirective,
        TestComponent,
        CustomEditor,
      ],
    }).createComponent(TestComponent);
    fixture.componentInstance.items = generateData(10);
    fixture.detectChanges();
    await gridRender(fixture);
    grid = getGridPro();
  });

  describe('default editor', () => {
    it('should edit value', async () => {
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

  describe('custom editor', () => {
    it('should render custom editor', () => {
      const cell = getBodyCell(grid, 0, 1);
      enter(cell);

      expect(cell.firstElementChild).toBeTruthy();
      expect(cell.firstElementChild!.tagName).toEqual('TEST-CUSTOM-EDITOR');
    });

    it('should delegate value to custom input', () => {
      // Start editing cell, check input value
      let cell = getBodyCell(grid, 5, 1);
      enter(cell);
      fixture.detectChanges();

      let input = getEditorInput(grid, 5, 1);
      expect(input.value).toEqual('5');
      enter(input);

      // Check value is updated for different cell
      cell = getBodyCell(grid, 9, 1);
      enter(cell);
      fixture.detectChanges();

      input = getEditorInput(grid, 9, 1);
      expect(input.value).toEqual('9');
    });

    it('should delegate focus to custom input', () => {
      const cell = getBodyCell(grid, 0, 1);
      enter(cell);

      const input = getEditorInput(grid, 0, 1);
      expect(document.activeElement).toEqual(input);
    });

    it('should edit value', async () => {
      const cell = getBodyCell(grid, 0, 1);
      enter(cell);

      const input = getEditorInput(grid, 0, 1);
      write(input, '42');
      enter(input);

      expect(fixture.componentInstance.items[0].age).toBeInstanceOf(Number);
      expect(fixture.componentInstance.items[0].age).toEqual(42);

      await gridRender(fixture);
      expect(getBodyCell(grid, 0, 1).textContent).toEqual('42');
    });
  });
});
