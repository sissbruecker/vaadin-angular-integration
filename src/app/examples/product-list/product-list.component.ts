import { Component } from '@angular/core';
import { generateProducts, Product } from './model';
import { SubMenuItem } from '@vaadin/menu-bar/src/vaadin-menu-bar';
import { MenuBarItem, MenuBarItemSelectedEvent } from '@vaadin/menu-bar';
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-selection-column.js';
import '@vaadin/grid/vaadin-grid-sort-column.js';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/menu-bar';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  products: Product[] = generateProducts(500);
  selectedProducts: Product[] = [];

  productColumnOption: SubMenuItem = {
    text: 'Product',
    checked: true,
  };
  priceColumnOption: SubMenuItem = {
    text: 'Price',
    checked: true,
  };
  stockColumnOption: SubMenuItem = {
    text: 'Stock',
    checked: true,
  };
  columnOptions: MenuBarItem[] = [
    {
      text: 'Columns',
      children: [
        this.productColumnOption,
        this.priceColumnOption,
        this.stockColumnOption,
      ],
    },
  ];

  toggleColumn(e: MenuBarItemSelectedEvent) {
    const item = e.detail.value as SubMenuItem;

    item.checked = !item.checked;
  }

  removeProduct(productToRemove: Product) {
    this.products = this.products.filter(
      (product) => product.id != productToRemove.id
    );
  }

  raisePrice(product: Product) {
    product.price = product.price + 1;
  }

  raiseAllPrices() {
    this.products.forEach(this.raisePrice);
  }
}
