import { Component, OnInit } from '@angular/core';
import { GridSelectedItemsChangedEvent } from '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-tree-column.js';

@Component({
  selector: 'app-grid-performance',
  templateUrl: './grid-performance.component.html',
})
export class GridPerformanceComponent implements OnInit {
  photos: any[] = [];
  selectedItems: any[] = [];

  handleSelectionChange(event: GridSelectedItemsChangedEvent<any>) {
    this.selectedItems = event.detail.value;
  }

  ngOnInit() {
    fetch('https://jsonplaceholder.typicode.com/photos')
      .then((response) => response.json())
      .then((data) => {
        this.photos = data;
      });
  }
}
