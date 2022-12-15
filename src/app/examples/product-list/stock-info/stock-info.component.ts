import { Component, Input } from '@angular/core';
import { Product } from '../model';
import '@vaadin/progress-bar';

@Component({
  selector: 'app-stock-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.css'],
})
export class StockInfoComponent {
  stock?: number;
  loading: boolean = false;
  loadTimeout?: any;

  @Input() set product(value: Product) {
    this.loadStockInfo(value);
  }

  private loadStockInfo(product: Product) {
    // Fake async call
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
    }
    this.loading = true;
    this.loadTimeout = setTimeout(() => {
      this.stock = product.id;
      this.loading = false;
    }, 1000);
  }
}
