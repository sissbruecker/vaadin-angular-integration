import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VaadinGridRendererDirective } from './vaadin-grid.directive';
import '@vaadin/grid';

interface TestItem {
  index: number;
}

function generateItems(count: number): TestItem[] {
  const result: TestItem[] = [];

  for (let index = 0; index < count; index++) {
    result.push({ index });
  }

  return result;
}

describe('vaadin-grid.directive', () => {
  @Component({
    template: `
      <vaadin-grid [items]="items">
        <!-- Text nodes only -->
        <vaadin-grid-column header="A">
          <ng-template #cell let-item="row.item">A{{ item.index }}</ng-template>
        </vaadin-grid-column>
        <!-- Element nodes -->
        <vaadin-grid-column header="B">
          <ng-template #cell let-item="row.item">
            <b>B</b><i>{{ item.index }}</i>
          </ng-template>
        </vaadin-grid-column>
        <!-- Conditional elements -->
        <vaadin-grid-column header="C">
          <ng-template #cell let-item="row.item">
            <span *ngIf="item.index >= 5">C{{ item.index }}</span>
          </ng-template>
        </vaadin-grid-column>
      </vaadin-grid>
    `,
  })
  class TestComponent {
    items: TestItem[] = [];
  }

  let fixture: ComponentFixture<TestComponent>;

  async function aFrame() {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  async function gridRender() {
    // Wait for grid to trigger rendering
    await aFrame();
    // Grid directive defers actual cell rendering into next frame, so wait for that
    await aFrame();
    // Run change detection again to update bindings in rendered cells
    fixture.detectChanges();
  }

  function getCell(rowIndex: number, columnIndex: number): HTMLElement {
    // Assuming there is only one grid at a time
    const grid = document.querySelector('vaadin-grid') as any;
    // Get table body
    const rows = grid.$.items;
    // Get TR element from index
    const row: any = Array.from(rows.children).find(
      (row: any) => row.index === rowIndex
    );
    expect(row).withContext(`Row ${rowIndex} does not exist`).toBeTruthy();
    // Get TD element from index
    const cells = row.querySelectorAll('td');
    const cell = cells[columnIndex];
    expect(cell).withContext(`Cell ${columnIndex} does not exist`).toBeTruthy();
    // First child of each TD is a slot, return first child within slot, which is a vaadin-grid-cell-content element
    return cell.firstElementChild.assignedNodes()[0];
  }

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      declarations: [VaadinGridRendererDirective, TestComponent],
    }).createComponent(TestComponent);
    fixture.componentInstance.items = generateItems(10);
    fixture.detectChanges();
    await gridRender();
  });

  it('should render text node content in column A', () => {
    const verifyTextContent = (rowIndex: number) => {
      const cell = getCell(rowIndex, 0);
      expect(cell.firstElementChild).toBeFalsy();
      expect(cell.textContent).toEqual(`A${rowIndex}`);
    };

    verifyTextContent(0);
    verifyTextContent(3);
    verifyTextContent(6);
  });

  it('should render updated text node content in column A', async () => {
    // Increase all indices by 10
    fixture.componentInstance.items = fixture.componentInstance.items.map(
      (item) => ({ index: item.index + 10 })
    );
    fixture.detectChanges();
    await gridRender();

    const verifyTextContent = (rowIndex: number) => {
      const cell = getCell(rowIndex, 0);
      expect(cell.firstElementChild).toBeFalsy();
      expect(cell.textContent).toEqual(`A${rowIndex + 10}`);
    };

    verifyTextContent(0);
    verifyTextContent(3);
    verifyTextContent(6);
  });

  it('should render element content in column B', () => {
    const verifyContent = (rowIndex: number) => {
      const cell = getCell(rowIndex, 1);
      expect(cell.children.length).toEqual(2);
      expect(cell.children[0].tagName).toEqual('B');
      expect(cell.children[0].textContent).toEqual('B');
      expect(cell.children[1].tagName).toEqual('I');
      expect(cell.children[1].textContent).toEqual(rowIndex.toString());
    };

    verifyContent(0);
    verifyContent(3);
    verifyContent(6);
  });

  it('should render updated element content in column B', async () => {
    // Increase all indices by 10
    fixture.componentInstance.items = fixture.componentInstance.items.map(
      (item) => ({ index: item.index + 10 })
    );
    fixture.detectChanges();
    await gridRender();

    const verifyContent = (rowIndex: number) => {
      const cell = getCell(rowIndex, 1);
      expect(cell.children.length).toEqual(2);
      expect(cell.children[0].tagName).toEqual('B');
      expect(cell.children[0].textContent).toEqual('B');
      expect(cell.children[1].tagName).toEqual('I');
      expect(cell.children[1].textContent).toEqual((rowIndex + 10).toString());
    };

    verifyContent(0);
    verifyContent(3);
    verifyContent(6);
  });

  it('should render conditional content in column C', () => {
    const verifyContent = (rowIndex: number, visible: boolean) => {
      const cell = getCell(rowIndex, 2);
      if (visible) {
        expect(cell.children.length).toEqual(1);
        expect(cell.children[0].tagName).toEqual('SPAN');
        expect(cell.children[0].textContent).toEqual(`C${rowIndex}`);
      } else {
        expect(cell.children.length).toEqual(0);
        expect(cell.textContent).toEqual('');
      }
    };
    // First five rows have no content
    verifyContent(0, false);
    verifyContent(4, false);
    // Remaining rows have content
    verifyContent(5, true);
    verifyContent(9, true);
  });

  it('should render updated conditional content in column C', async () => {
    // Increase all indices by 3
    fixture.componentInstance.items = fixture.componentInstance.items.map(
      (item) => ({ index: item.index + 3 })
    );
    fixture.detectChanges();
    await gridRender();

    const verifyContent = (rowIndex: number, visible: boolean) => {
      const cell = getCell(rowIndex, 2);
      if (visible) {
        expect(cell.children.length).toEqual(1);
        expect(cell.children[0].tagName).toEqual('SPAN');
        expect(cell.children[0].textContent).toEqual(`C${rowIndex + 3}`);
      } else {
        expect(cell.children.length).toEqual(0);
        expect(cell.textContent).toEqual('');
      }
    };

    // First two rows have no content
    verifyContent(0, false);
    verifyContent(1, false);
    // Remaining rows have content
    verifyContent(2, true);
    verifyContent(3, true);
  });
});
