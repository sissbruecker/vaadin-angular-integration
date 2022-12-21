import { aFrame } from './helpers';
import { ComponentFixture } from '@angular/core/testing';
import { Grid } from '@vaadin/grid';
import { GridPro } from '@vaadin/grid-pro';

export async function gridRender(fixture: ComponentFixture<unknown>) {
  // Wait for grid to trigger rendering
  await aFrame();
  // Grid directive defers actual cell rendering into next frame, so wait for that
  await aFrame();
  // Run change detection again to update bindings in rendered cells
  fixture.detectChanges();
}

export function getGrid(): Grid {
  // Assuming there is only one grid at a time
  return document.querySelector('vaadin-grid') as any;
}

export function getGridPro(): GridPro {
  // Assuming there is only one grid at a time
  return document.querySelector('vaadin-grid-pro') as any;
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
  return cell as HTMLElement;
}

function getCellContent(cell: HTMLElement): HTMLElement {
  // First child of each cell is a slot, return content element assigned to that
  return (
    cell.firstElementChild as HTMLSlotElement
  ).assignedNodes()[0] as HTMLElement;
}

export function getBodyCell(
  grid: HTMLElement,
  rowIndex: number,
  columnIndex: number
): HTMLElement {
  const body = (grid as any).$.items;
  return getCellContent(getCell(body, rowIndex, columnIndex));
}

export function getHeaderCell(
  grid: HTMLElement,
  rowIndex: number,
  columnIndex: number
): HTMLElement {
  const header = (grid as any).$.header;
  return getCellContent(getCell(header, rowIndex, columnIndex));
}

export function getFooterCell(
  grid: HTMLElement,
  rowIndex: number,
  columnIndex: number
): HTMLElement {
  const footer = (grid as any).$.footer;
  return getCellContent(getCell(footer, rowIndex, columnIndex));
}

export function getEditorInput(
  grid: HTMLElement,
  rowIndex: number,
  columnIndex: number
): HTMLInputElement {
  const cellContent = getBodyCell(grid, rowIndex, columnIndex);
  const input = cellContent.querySelector('input') as HTMLInputElement;
  expect(input).toBeTruthy();
  return input;
}
