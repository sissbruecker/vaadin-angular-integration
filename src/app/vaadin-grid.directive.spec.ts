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
        <!-- With custom header -->
        <vaadin-grid-column header="D">
          <ng-template #header>
            <span>{{ headerLabel }}</span>
          </ng-template>
        </vaadin-grid-column>
        <!-- With custom footer -->
        <vaadin-grid-column header="E">
          <ng-template #footer>
            <span>{{ footerLabel }}</span>
          </ng-template>
        </vaadin-grid-column>
        <!-- Removable column -->
        <vaadin-grid-column header="F" *ngIf="!hideColumn">
          <ng-template #cell let-item="row.item">F{{ item.index }}</ng-template>
        </vaadin-grid-column>
      </vaadin-grid>
    `,
  })
  class TestComponent {
    items: TestItem[] = [];
    headerLabel: string = 'Custom header';
    footerLabel: string = 'Custom footer';
    hideColumn: boolean = false;
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

  function getCell(
    container: HTMLElement,
    rowIndex: number,
    columnIndex: number
  ): HTMLElement {
    // Get TR element from container
    const row = container.children[rowIndex];
    expect(row).withContext(`Row ${rowIndex} does not exist`).toBeTruthy();
    // Get TD/TH element from row
    const cell = row.children[columnIndex];
    expect(cell).withContext(`Cell ${columnIndex} does not exist`).toBeTruthy();
    // First child of each TD/TH is a slot, return first child within slot, which is a vaadin-grid-cell-content element
    return (
      cell.firstElementChild as HTMLSlotElement
    ).assignedNodes()[0] as HTMLElement;
  }

  function getBodyCell(rowIndex: number, columnIndex: number): HTMLElement {
    // Assuming there is only one grid at a time
    const grid = document.querySelector('vaadin-grid') as any;
    // Get table body
    const body = grid.$.items;

    return getCell(body, rowIndex, columnIndex);
  }

  function getHeaderCell(columnIndex: number): HTMLElement {
    // Assuming there is only one grid at a time
    const grid = document.querySelector('vaadin-grid') as any;
    // Get table header
    const header = grid.$.header;

    return getCell(header, 0, columnIndex);
  }

  function getFooterCell(columnIndex: number): HTMLElement {
    // Assuming there is only one grid at a time
    const grid = document.querySelector('vaadin-grid') as any;
    // Get table footer
    const footer = grid.$.footer;

    return getCell(footer, 0, columnIndex);
  }

  function getColumnCount() {
    // Assuming there is only one grid at a time
    const grid = document.querySelector('vaadin-grid') as any;
    // Get first row
    const row: any = grid.$.items.children[0];
    expect(row).withContext(`There are no rows`).toBeTruthy();
    // Count cells in row
    return row.children.length;
  }

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      declarations: [VaadinGridRendererDirective, TestComponent],
    }).createComponent(TestComponent);
    fixture.componentInstance.items = generateItems(10);
    fixture.detectChanges();
    await gridRender();
  });

  describe('body cells', () => {
    it('should render text node content in column A', () => {
      const verifyCellContent = (rowIndex: number) => {
        const cell = getBodyCell(rowIndex, 0);
        expect(cell.firstElementChild).toBeFalsy();
        expect(cell.textContent).toEqual(`A${rowIndex}`);
      };

      verifyCellContent(0);
      verifyCellContent(3);
      verifyCellContent(6);
    });

    it('should render updated text node content in column A', async () => {
      // Increase all indices by 10
      fixture.componentInstance.items = fixture.componentInstance.items.map(
        (item) => ({ index: item.index + 10 })
      );
      fixture.detectChanges();
      await gridRender();

      const verifyCellContent = (rowIndex: number) => {
        const cell = getBodyCell(rowIndex, 0);
        expect(cell.firstElementChild).toBeFalsy();
        expect(cell.textContent).toEqual(`A${rowIndex + 10}`);
      };

      verifyCellContent(0);
      verifyCellContent(3);
      verifyCellContent(6);
    });

    it('should render element content in column B', () => {
      const verifyCellContent = (rowIndex: number) => {
        const cell = getBodyCell(rowIndex, 1);
        expect(cell.children.length).toEqual(2);
        expect(cell.children[0].tagName).toEqual('B');
        expect(cell.children[0].textContent).toEqual('B');
        expect(cell.children[1].tagName).toEqual('I');
        expect(cell.children[1].textContent).toEqual(rowIndex.toString());
      };

      verifyCellContent(0);
      verifyCellContent(3);
      verifyCellContent(6);
    });

    it('should render updated element content in column B', async () => {
      // Increase all indices by 10
      fixture.componentInstance.items = fixture.componentInstance.items.map(
        (item) => ({ index: item.index + 10 })
      );
      fixture.detectChanges();
      await gridRender();

      const verifyCellContent = (rowIndex: number) => {
        const cell = getBodyCell(rowIndex, 1);
        expect(cell.children.length).toEqual(2);
        expect(cell.children[0].tagName).toEqual('B');
        expect(cell.children[0].textContent).toEqual('B');
        expect(cell.children[1].tagName).toEqual('I');
        expect(cell.children[1].textContent).toEqual(
          (rowIndex + 10).toString()
        );
      };

      verifyCellContent(0);
      verifyCellContent(3);
      verifyCellContent(6);
    });

    it('should render conditional content in column C', () => {
      const verifyCellContent = (rowIndex: number, visible: boolean) => {
        const cell = getBodyCell(rowIndex, 2);
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
      verifyCellContent(0, false);
      verifyCellContent(4, false);
      // Remaining rows have content
      verifyCellContent(5, true);
      verifyCellContent(9, true);
    });

    it('should render updated conditional content in column C', async () => {
      // Increase all indices by 3
      fixture.componentInstance.items = fixture.componentInstance.items.map(
        (item) => ({ index: item.index + 3 })
      );
      fixture.detectChanges();
      await gridRender();

      const verifyCellContent = (rowIndex: number, visible: boolean) => {
        const cell = getBodyCell(rowIndex, 2);
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
      verifyCellContent(0, false);
      verifyCellContent(1, false);
      // Remaining rows have content
      verifyCellContent(2, true);
      verifyCellContent(3, true);
    });
  });

  describe('header cells', () => {
    it('should render custom header in column D', () => {
      const cell = getHeaderCell(3);
      expect(cell.children.length).toEqual(1);
      expect(cell.children[0].tagName).toEqual('SPAN');
      expect(cell.children[0].textContent).toEqual(`Custom header`);
    });

    it('should render updated custom header in column D', () => {
      fixture.componentInstance.headerLabel = 'Updated header';
      fixture.detectChanges();

      const cell = getHeaderCell(3);
      expect(cell.children.length).toEqual(1);
      expect(cell.children[0].tagName).toEqual('SPAN');
      expect(cell.children[0].textContent).toEqual(`Updated header`);
    });

    it('should not modify other column headers', () => {
      const verifyHeader = (columnIndex: number, textContent: string) => {
        const cell = getHeaderCell(columnIndex);
        expect(cell.firstElementChild).toBeFalsy();
        expect(cell.textContent).toEqual(textContent);
      };

      verifyHeader(0, 'A');
      verifyHeader(1, 'B');
      verifyHeader(2, 'C');
      verifyHeader(4, 'E');
    });
  });

  describe('footer cells', () => {
    it('should render custom footer in column E', () => {
      const cell = getFooterCell(4);
      expect(cell.children.length).toEqual(1);
      expect(cell.children[0].tagName).toEqual('SPAN');
      expect(cell.children[0].textContent).toEqual(`Custom footer`);
    });

    it('should render updated custom footer in column E', () => {
      fixture.componentInstance.footerLabel = 'Updated footer';
      fixture.detectChanges();

      const cell = getFooterCell(4);
      expect(cell.children.length).toEqual(1);
      expect(cell.children[0].tagName).toEqual('SPAN');
      expect(cell.children[0].textContent).toEqual(`Updated footer`);
    });

    it('should not modify other column footers', () => {
      const verifyFooter = (columnIndex: number, textContent: string) => {
        const cell = getFooterCell(columnIndex);
        expect(cell.firstElementChild).toBeFalsy();
        expect(cell.textContent).toEqual(textContent);
      };

      verifyFooter(0, '');
      verifyFooter(1, '');
      verifyFooter(2, '');
      verifyFooter(3, '');
    });
  });

  describe('removing and adding column', () => {
    it('should remove and add column', async () => {
      const initialColumnCount = getColumnCount();

      // Hide column
      fixture.componentInstance.hideColumn = true;
      fixture.detectChanges();
      await gridRender();

      // Should not render cells for toggled column
      expect(getColumnCount()).toEqual(initialColumnCount - 1);

      // Show column again
      fixture.componentInstance.hideColumn = false;
      fixture.detectChanges();
      await gridRender();

      // Should render cells for toggled column
      expect(getColumnCount()).toEqual(initialColumnCount);
      expect(getBodyCell(0, 5).textContent).toEqual('F0');
      expect(getBodyCell(1, 5).textContent).toEqual('F1');
      expect(getBodyCell(2, 5).textContent).toEqual('F2');
    });
  });
});
